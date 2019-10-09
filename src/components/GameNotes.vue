<template lang="html">
    <div class="game-notes">
        <h4>{{ $t('notes.notes') }}</h4>

        <div
            class="note"
            v-if="hasNote && !editingNote"
            @click="editNote"
        >
            <i class="fas fa-sticky-note corner-icon" />

            <p v-html="formattedNoteText" />
        </div>

        <div class="note" v-if="editingNote">
            <i class="fas fa-sticky-note corner-icon" />

            <div
                class="read"
                v-if="localNote && !editingNote"
                @click="editNote"
            >
                <p>{{ localNote.text }}</p>
            </div>

            <div class="edit" v-if="editingNote">
                <textarea
                    v-model="localNote.text"
                    class="game-note-field"
                    maxlength="1024"
                />

                <div class="note-actions">
                    <button
                        class="small secondary"
                        @click="reset"
                    >
                        {{ $t('global.cancel') }}
                    </button>

                    <button
                        class="small danger"
                        @click="deleteNote"
                    >
                        <i class="far fa-trash-alt" />
                    </button>

                    <button
                        class="small primary"
                        @click="saveNote"
                        :disabled="!localNote"
                    >
                        {{ $t('global.save') }}
                    </button>
                </div>
            </div>
        </div>

        <button
            class="primary"
            @click="addNote"
            v-if="!hasNote && !editingNote"
        >
            <i class="fas fa-sticky-note" />
            {{ $t('notes.addNote') }}
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            editingNote: false,
            localNote: {
                text: null,
            },
        };
    },

    computed: {
        ...mapState(['game', 'notes']),

        hasNote() {
            return this.localNote && this.localNote.text;
        },

        formattedNoteText() {
            return this.localNote.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        },
    },

    mounted() {
        this.getNote();
    },

    methods: {
        getNote() {
            this.localNote = this.notes && this.notes[this.game.id]
                ? JSON.parse(JSON.stringify(this.notes[this.game.id]))
                : { text: null };
        },

        addNote() {
            this.getNote();
            this.editingNote = true;
        },

        editNote() {
            this.editingNote = true;
        },

        reset() {
            this.getNote();
            this.editingNote = false;
        },

        deleteNote() {
            const updatedNotes = {
                ...this.notes,
            };

            this.$delete(updatedNotes, this.game.id);

            this.$bus.$emit('SAVE_NOTES', updatedNotes, true);
            this.editingNote = false;
            this.localNote = {
                text: null,
            };
        },

        saveNote() {
            const updatedNotes = {
                ...this.notes,
            };

            updatedNotes[this.game.id] = this.localNote;

            this.$bus.$emit('SAVE_NOTES', updatedNotes);
            this.editingNote = false;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .game-notes {
        margin-top: $gp;
    }

    h4 {
        padding-bottom: $gp / 2;
    }

    .note {
        cursor: pointer;
        border: 2px solid var(--note-color);
        border-radius: $border-radius;
        position: relative;
        overflow: hidden;
        min-width: 200px;
        max-width: 100%;
        display: inline-flex;
        flex-direction: column;
        padding: $gp / 2 $gp $gp / 2 $gp * 2;

        @media($small) {
            margin: $gp auto;
        }

        .corner-icon {
            background: var(--note-color);
            color: #fff;
            padding: $gp / 4;
            position: absolute;
            border-bottom-right-radius: $border-radius;
            top: 0;
            left: 0;
        }

        p {
            font-size: 12px;
            margin: 0;
            display: inline-flex;
        }
    }

    .game-note-field {
        resize: vertical;
        border-radius: $border-radius;
        border: 1px solid #a5a2a2;
        width: 100%;
        min-height: 60px;
        max-height: 300px;
    }

    .note-actions {
        display: flex;
        align-items: center;
        grid-gap: $gp / 2;
        margin-top: $gp / 4;

        .success {
            margin-left: auto;
        }
    }
</style>
