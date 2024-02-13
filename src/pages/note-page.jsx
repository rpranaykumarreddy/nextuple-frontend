//short-page.js
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';


import AddIcon from '@mui/icons-material/Add';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import NoteForm from '../components/note-form';
import NotesList from '../components/note-list';
/**
 *Note making app
- Collect and store favorite notes or philosophical insights.
- Categorize notes based on themes.
- Provide the option to share notes on social media or with friends as Image.
- It also has the note version as it store the old version of the note in a array as it appends new one at the end.
store.notesDB ={
    allThemes: [theme1, theme2, theme3],
    notes: {
        [note-id]:{
            title: [title1, title2, title3],
            note: [note1, note2, note3],
            themes: [theme1, theme2],
            likes: 12,
            isDeleted: false,
            isArchived: false,
            createdAt: 1234567890
        },
        [note-id]:{
            title: [title1, title2, title3],
            note: [note1, note2, note3],
            themes: [theme3],
            likes: 10,
            isDeleted: false,
            isArchived: false,
            createdAt: 1234567890
        }
    }
}
 */

export default function NotePage() {
    const [CreateModal, setCreateModal] = useState(false);

    const handleClose = () => {
        setCreateModal(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };
    return (
        <main>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 80, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    key="Add"
                    icon={<AddIcon />}
                    tooltipTitle="Add Note"
                    onClick={() => setCreateModal(true)}
                />
            </SpeedDial>
            <Modal
                open={CreateModal}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <div style={{ ...style }}>
                    <NoteForm onClose={handleClose} />
                </div>
            </Modal>
            <NotesList />
        </main>
    );
}
