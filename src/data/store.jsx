//store.js
import { configureStore, createSlice, nanoid } from '@reduxjs/toolkit';

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        allThemes: [],
        notes: {}
    },
    reducers: {
        addNote: (state, action) => {
            const { title, note, themes } = action.payload;
            const nid = nanoid();
            const createdAt = new Date().getTime();
            state.notes[nid] = {
                title: [title],
                note: [note],
                themes,
                likes: 0,
                isDeleted: false,
                isArchived: false,
                createdAt
            }
            state.allThemes = [...(new Set([...state.allThemes, ...themes]))];
        },
        editNote: (state, action) => {
            const { title, note, themes, nid, saveVersion } = action.payload;
            if (state.notes[nid] !== undefined) {
                if (saveVersion) {
                    state.notes[nid].note.push(note);
                    state.notes[nid].title.push(title);
                    state.notes[nid].themes = themes;
                } else {
                    state.notes[nid].note[state.notes[nid].note.length - 1] = note;
                    state.notes[nid].title[state.notes[nid].title.length - 1] = title;
                    state.notes[nid].themes = themes;
                }
                state.allThemes = [...(new Set([...state.allThemes, ...themes]))];
            } else {
                console.error('Note not found');
            }
        },
        deleteNote: (state, action) => {
            const { nid } = action.payload;
            if (state.notes[nid] !== undefined) {
                state.notes[nid].isDeleted = true;
            }
        },
        archiveNote: (state, action) => {
            const { nid } = action.payload;
            if (state.notes[nid] !== undefined) {
                state.notes[nid].isArchived = true;
            }
        },
        likeNote: (state, action) => {
            const { nid } = action.payload;
            if (state.notes[nid] !== undefined) {
                state.notes[nid].likes++;
            }
        },
        restoreNote: (state, action) => {
            const { nid } = action.payload;
            if (state.notes[nid] !== undefined) {
                state.notes[nid].isDeleted = false;
            }
        },
        unArchiveNote: (state, action) => {
            const { nid } = action.payload;
            if (state.notes[nid] !== undefined) {
                state.notes[nid].isArchived = false;
            }
        }
    }
});

const notesReducer = notesSlice.reducer;

const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Error loading state from local storage:', error);
        return undefined;
    }
};

const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
    return result;
};

const store = configureStore({
    reducer: {
        notesDB: notesReducer
    },
    preloadedState: loadStateFromLocalStorage(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});
export const { addNote, editNote, deleteNote, archiveNote, likeNote, restoreNote, unArchiveNote } = notesSlice.actions;
export default store;
