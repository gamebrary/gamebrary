import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';
import orderby from 'lodash.orderby';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 20;

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: [],
    board: {},
    publicBoards: [],
    // Pagination state
    boardsLastDoc: null,
    boardsHasMore: true,
    publicBoardsLastDoc: null,
    publicBoardsHasMore: true,
  }),

  persist: {
    paths: ['boards'],
  },

  getters: {
    sortedBoards: (state) => orderby(state.boards, 'lastUpdated', 'desc'),
    sortedPublicBoards: (state) => orderby(state.publicBoards, 'lastUpdated', 'desc'),
    activeBoard: (state) => state.board,
  },

  actions: {
    async loadBoards(userId, options = {}) {
      const {
        pageSize = DEFAULT_PAGE_SIZE,
        reset = false,
        lastDoc = null,
      } = options;

      // Reset pagination state if requested
      if (reset) {
        this.boards = [];
        this.boardsLastDoc = null;
        this.boardsHasMore = true;
      }

      try {
        // Build query constraints - try with orderBy first
        const constraints = [
          where('owner', '==', userId),
          orderBy('lastUpdated', 'desc'),
          limit(pageSize)
        ];

        // Add startAfter if we have a last document
        if (lastDoc || this.boardsLastDoc) {
          constraints.push(startAfter(lastDoc || this.boardsLastDoc));
        }

        // Build query with all constraints
        const q = query(collection(db, 'boards'), ...constraints);

        const querySnapshot = await getDocs(q);
        const boards = querySnapshot.docs.map((docSnap) => ({
          lastUpdated: docSnap.data().lastUpdated || docSnap.data().dateCreated || 0,
          ...docSnap.data(),
          id: docSnap.id,
        }));

        // Update state
        this.boards = reset ? boards : [...this.boards, ...boards];
        this.boardsHasMore = querySnapshot.docs.length === pageSize;

        // Store last document for next page
        if (querySnapshot.docs.length > 0) {
          this.boardsLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        } else {
          this.boardsHasMore = false;
        }

        return {
          boards,
          hasMore: this.boardsHasMore,
          lastDoc: this.boardsLastDoc,
        };
      } catch (error) {
        // Check if it's an index error
        const isIndexError = error?.code === 'failed-precondition' ||
                            error?.message?.includes('index') ||
                            error?.message?.includes('requires an index');

        // Only log non-index errors, or log index errors at debug level
        // Index errors are expected until the index is deployed, and fallback works fine
        if (!isIndexError) {
          console.warn('Failed to load boards with orderBy, falling back to simple query:', error);
        }
        // Index errors are silently handled - the fallback query works correctly

        // For fallback, load all boards and sort client-side (pagination disabled in fallback)
        try {
          const q = query(
            collection(db, 'boards'),
            where('owner', '==', userId)
          );

          const querySnapshot = await getDocs(q);
          let boards = querySnapshot.docs.map((docSnap) => ({
            lastUpdated: docSnap.data().lastUpdated || docSnap.data().dateCreated || 0,
            ...docSnap.data(),
            id: docSnap.id,
          }));

          // Sort client-side as fallback
          boards.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));

          // Update state - in fallback mode, show all boards
          this.boards = boards;
          this.boardsHasMore = false; // Disable pagination in fallback mode
          this.boardsLastDoc = null;

          return {
            boards,
            hasMore: false,
            lastDoc: null,
          };
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          // Return empty array if even fallback fails
          this.boards = [];
          this.boardsHasMore = false;
          this.boardsLastDoc = null;
          throw fallbackError;
        }
      }
    },

    async loadBoard(id, userId) {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid board ID');
      }

      const docSnap = await getDoc(doc(db, 'boards', id));

      if (!docSnap.exists()) {
        throw new Error('Board not found');
      }

      const board = docSnap.data();
      const forbiddenTenant = !board?.isPublic && board?.owner !== userId;

      if (forbiddenTenant) {
        throw new Error('Forbidden');
      } else {
        this.setActiveBoard({ ...board, id: docSnap.id });
        return { ...board, id: docSnap.id };
      }
    },

    async loadPublicBoards(options = {}) {
      const {
        pageSize = DEFAULT_PAGE_SIZE,
        reset = false,
        lastDoc = null,
      } = options;

      // Reset pagination state if requested
      if (reset) {
        this.publicBoards = [];
        this.publicBoardsLastDoc = null;
        this.publicBoardsHasMore = true;
      }

      // Build query constraints
      const constraints = [
        where('isPublic', '==', true),
        orderBy('lastUpdated', 'desc'),
        limit(pageSize)
      ];

      // Add startAfter if we have a last document
      if (lastDoc || this.publicBoardsLastDoc) {
        constraints.push(startAfter(lastDoc || this.publicBoardsLastDoc));
      }

      // Build query with all constraints
      const q = query(collection(db, 'boards'), ...constraints);

      const querySnapshot = await getDocs(q);
      const boards = querySnapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      }));

      // Update state
      this.publicBoards = reset ? boards : [...this.publicBoards, ...boards];
      this.publicBoardsHasMore = querySnapshot.docs.length === pageSize;

      // Store last document for next page
      if (querySnapshot.docs.length > 0) {
        this.publicBoardsLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      } else {
        this.publicBoardsHasMore = false;
      }

      return {
        boards,
        hasMore: this.publicBoardsHasMore,
        lastDoc: this.publicBoardsLastDoc,
      };
    },

    async loadUserPublicBoards(userId) {
      const q = query(
        collection(db, 'boards'),
        where('owner', '==', userId),
        where('isPublic', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs?.map((doc) => doc.data());
    },

    async createBoard(board) {
      const docRef = await addDoc(collection(db, 'boards'), board);
      const newBoard = { ...board, id: docRef.id };
      this.boards.push(newBoard);
      return newBoard;
    },

    async saveBoard() {
      await setDoc(doc(db, 'boards', this.board.id), { ...this.board, lastUpdated: Date.now() });
    },

    async saveGameBoard(board) {
      const updatedBoard = {
        ...board,
        lastUpdated: Date.now(),
      };
      await setDoc(doc(db, 'boards', board.id), updatedBoard, { merge: true });
      this.setGameBoard(updatedBoard);
    },

    async deleteBoard(id) {
      await deleteDoc(doc(db, 'boards', id));
      const boardIndex = this.boards.findIndex(({ id: boardId }) => boardId === id);
      if (boardIndex !== -1) {
        this.boards.splice(boardIndex, 1);
      }
    },

    setBoards(boards) {
      this.boards = boards;
    },

    setActiveBoard(board) {
      this.board = board;
      const boardIndex = this.boards.findIndex(({ id }) => board.id === id);
      if (boardIndex !== -1) {
        this.boards[boardIndex] = board;
      }
    },

    setGameBoard(board) {
      this.board = board;
    },

    clearBoard() {
      this.board = {};
    },

    setPublicBoards(boards) {
      this.publicBoards = boards;
    },

    addBoard(board) {
      this.boards.push(board);
    },

    addList(list) {
      this.board.lists.push(list);
    },

    moveListLeft(listIndex) {
      if (listIndex <= 0) return;
      const [list] = this.board.lists.splice(listIndex, 1);
      this.board.lists.splice(listIndex - 1, 0, list);
    },

    moveListRight(listIndex) {
      const listsCount = this.board?.lists?.length || 0;
      if (listIndex > listsCount - 1) return;
      const [list] = this.board.lists.splice(listIndex, 1);
      this.board.lists.splice(listIndex + 1, 0, list);
    },
  },
});

