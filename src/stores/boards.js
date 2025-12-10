import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';
import orderby from 'lodash.orderby';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: [],
    board: {},
    publicBoards: [],
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
    async loadBoards(userId) {
      const q = query(collection(db, 'boards'), where('owner', '==', userId));
      const querySnapshot = await getDocs(q);
      const boards = querySnapshot.docs.map((doc) => ({
        lastUpdated: 0,
        ...doc.data(),
        id: doc.id,
      }));
      this.boards = boards || [];
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

    async loadPublicBoards() {
      const querySnapshot = await getDocs(query(collection(db, 'boards'), where('isPublic', '==', true)));
      const boards = querySnapshot.docs.map((doc) => doc.data());
      this.publicBoards = boards;
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

