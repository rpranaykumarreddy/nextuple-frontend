//short-page.js
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';


import MoreVertIcon from '@mui/icons-material/MoreVert';
import Autocomplete from "@mui/material/Autocomplete";
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import NoteCard from './note-card';

export default function NotesList() {
    const notesDB = useSelector((state) => state.notesDB.notes) || {};
    const themesDB = useSelector((state) => state.notesDB.allThemes) || [];

    const [filterThemes, setFilterThemes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortAnchorEl, setSortAnchorEl] = useState('desc: likes');
    const [showArchived, setShowArchived] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [allThemes, setAllThemes] = useState(true);
    const [CreateCardModal, setCreateCardModal] = useState(false);
    const [noteID, setNoteID] = useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggleArchived = () => {
        setShowArchived(!showArchived);
    };

    const handleToggleDeleted = () => {
        setShowDeleted(!showDeleted);
    };

    const handleToggleAllThemes = () => {
        setAllThemes(!allThemes);
    };

    const filteredNotes = Object.keys(notesDB)
        .filter((noteKey) => {
            const note = notesDB[noteKey];
            const matchesThemes =
                filterThemes.length === 0 ||
                (allThemes
                    ? filterThemes.every((theme) => note.themes.includes(theme))
                    : filterThemes.some((theme) => note.themes.includes(theme)));
            const matchesSearch =
                searchText === '' ||
                note.note.some((noteText) =>
                    noteText.toLowerCase().includes(searchText.toLowerCase())
                ) || note.title.some((noteText) =>
                    noteText.toLowerCase().includes(searchText.toLowerCase())
                );
            const isArchived = note.isArchived && !showArchived;
            const isDeleted = note.isDeleted && !showDeleted;

            return matchesThemes && matchesSearch && !isArchived && !isDeleted;
        })
        .sort((a, b) => {
            const [sortType, sortField] = sortAnchorEl?.split(':') || [];
            if (sortType === 'asc') {
                if (sortField === 'time') {
                    return notesDB[a].createdAt - notesDB[b].createdAt;
                } else if (sortField === 'likes') {
                    return (
                        notesDB[a].likes - notesDB[b].likes || notesDB[a].createdAt - notesDB[b].createdAt
                    );
                }
            } else if (sortType === 'desc') {
                if (sortField === 'time') {
                    return notesDB[b].createdAt - notesDB[a].createdAt;
                } else if (sortField === 'likes') {
                    return (
                        notesDB[b].likes - notesDB[a].likes || notesDB[b].createdAt - notesDB[a].createdAt
                    );
                }
            }
            return 0;
        });

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'themes', headerName: 'Themes', flex: 1 },
        { field: 'likes', headerName: 'Likes', flex: 1 },
    ];

    const rows = filteredNotes.map((noteKey) => {
        const note = notesDB[noteKey];
        return {
            id: noteKey,
            title: note.title[note.title.length - 1],
            themes: note.themes.join(', '),
            likes: note.likes,
            createdAt: note.createdAt,
        };
    });

    const handleRowClick = (params) => {
        const { id } = params.row;
        setNoteID(id);
        setCreateCardModal(true);
    };

    const handleCardClose = () => {
        setCreateCardModal(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const setSnackBar = (msg) => {
        setSnackbarMsg(msg);
        setSnackbarOpen(true);
    };
    return (
        <>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMsg}
            />
            <div style={{
                margin: '15px 0px', height: 'fit-content',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Modal
                    open={CreateCardModal}
                    onClose={handleCardClose}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }}
                >
                    <div style={{ ...style }}>
                        <NoteCard noteKey={noteID} setSnackBar={setSnackBar} />
                    </div>
                </Modal>
                <>
                    <Card sx={{
                        width: '90vw',
                        padding: 1,
                        margin: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        height: 'fit-content',
                        alignContent: 'center',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        '@media (max-width: 900px)': {
                            flexWrap: 'wrap'
                        },
                    }}>
                        <Autocomplete
                            limitTags={2}
                            id="multiple-limit-tags"
                            multiple
                            fullWidth
                            options={themesDB}
                            getOptionLabel={(option) => option}
                            value={filterThemes}
                            onChange={(e, selectedThemes) => setFilterThemes(selectedThemes)}
                            renderInput={(params) => (
                                <TextField {...params} label="Filter by Themes" placeholder="" />
                            )}
                            sx={{ minWidth: 300, margin: 1 }}
                        />
                        <TextField
                            label="Search"
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            sx={{
                                margin: 1, '@media (max-width: 900px)': {
                                    width: '80%'
                                },
                            }}
                        />
                        <Tooltip title="Sort">
                            <IconButton onClick={handleClick} >
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                    </Card>


                    <div >
                        {/* {filteredNotes.map((noteKey) => (
                        // <NoteCard noteKey={noteKey} key={noteKey} />
                        <NoteGlimpses noteKey={noteKey} key={noteKey} />
                    ))} */}
                        <Card
                            sx={{
                                width: '90vw',
                                borderRadius: 1,
                            }}
                        >
                            <div style={{ width: '100%' }}>
                                <DataGrid

                                    sx={{
                                        margin: 1,
                                        borderRadius: 1,
                                    }}
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    onRowClick={handleRowClick}
                                />
                            </div>
                        </Card>
                        {filteredNotes.length < 1 && <h3>No Matching Notes</h3>}
                    </div>
                </>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {/* <MenuItem onClick={() => setSortAnchorEl('asc:time')}>
                    Sort by Time Ascending
                </MenuItem>
                <MenuItem onClick={() => setSortAnchorEl('desc:time')}>
                    Sort by Time Descending
                </MenuItem>
                <MenuItem onClick={() => setSortAnchorEl('desc:likes')}>
                    Sort by more likes
                </MenuItem>
                <MenuItem onClick={() => setSortAnchorEl('asc:likes')}>
                    Sort by less likes
                </MenuItem>
                <Divider /> */}
                    <MenuItem>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showArchived}
                                    onChange={handleToggleArchived}
                                />
                            }
                            label="Show Archived"
                        />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showDeleted}
                                    onChange={handleToggleDeleted}
                                />
                            }
                            label="Show Deleted"
                        />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={allThemes}
                                    onChange={handleToggleAllThemes}
                                />
                            }
                            label="Match All Themes"
                        />
                    </MenuItem>
                </Menu>
            </div></>
    );
};
