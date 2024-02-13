//short-page.js
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import html2canvas from 'html2canvas';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, archiveNote, deleteNote, editNote, likeNote, restoreNote, unArchiveNote } from '../data/store';


import AddIcon from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/Archive';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestoreIcon from '@mui/icons-material/Restore';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Alert from '@mui/material/Alert';
import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
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
const NoteForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const themesDB = useSelector((state) => state.notesDB.allThemes) || [];
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [themes, setThemes] = useState([]);
    const [options, setOptions] = useState([...themesDB]);
    const [inpTextValue, setInpText] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() === '') {
            setErrorMessage('Title cannot be empty');
            return false;
        } else if (note.trim() === '') {
            setErrorMessage('Note cannot be empty');
            return false;
        } else if (themes.length < 1) {
            setErrorMessage('Themes cannot be empty');
            return false;
        } else {
            setErrorMessage('');
        }
        setDisabled(true);
        let data = {
            note: note.trim(),
            themes,
            title
        }
        dispatch(addNote(data));
        setNote('');
        setThemes([]);
        setDisabled(false);
        onClose();
    };

    const handleOptionType = (e) => {
        if (e.target.value !== null) {
            const lowerCaseValue = e.target.value.toLowerCase().trim();
            setInpText(lowerCaseValue);
        }
    }
    const handleOptionChange = (e) => {
        if (e.target.value.trim() !== '') {
            if (e.key === "Enter") {
                if (!options.includes(e.target.value)) {
                    setOptions(
                        (prev) => [...prev, e.target.value],
                    )
                } else {
                    if (!themes.includes(e.target.value)) {
                        setThemes(
                            (prev) => [...prev, e.target.value],
                        )
                        setInpText('');
                    }
                }
            }
        }
    }
    return (
        <Card sx={{ width: '90vw', maxWidth: '500px', margin: '0px', padding: '5px' }}>
            <CardContent>
                <h2>Add Note</h2>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                    margin="normal"
                    label="Title"
                    id="outlined-required"
                    required
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoComplete="off"
                />
                <TextField
                    multiline
                    margin="normal"
                    label="Note"
                    id="outlined-required"
                    required
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    autoComplete="off"
                />
                <Autocomplete
                    value={themes}
                    onChange={(e, selectedObject) => {
                        if (selectedObject !== null) {
                            setThemes(selectedObject);
                        }
                    }}
                    multiple
                    fullWidth
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={options}
                    renderInput={(params) => {
                        return (
                            <TextField
                                {...params}
                                value={inpTextValue}
                                onChange={handleOptionType}
                                onKeyDown={handleOptionChange}
                                label="Themes"
                                placeholder="Add Themes"
                                pattern="[a-z0-9]+"
                            />
                        );
                    }}
                />
                <br />
                <Button type="button" variant="contained" color="primary" onClick={handleSubmit} disabled={disabled}>
                    Add Note
                </Button>
            </CardContent>
        </Card>
    );
};

const NoteCard = ({ noteKey }) => {
    const noteCardRef = useRef(null);
    const dispatch = useDispatch();
    const notesDB = useSelector((state) => state.notesDB.notes) || {};
    const themesDB = useSelector((state) => state.notesDB.allThemes) || [];
    const [title, setTitle] = useState(notesDB[noteKey]?.title[notesDB[noteKey].title.length - 1]);
    const [note, setNote] = useState(notesDB[noteKey]?.note[notesDB[noteKey].note.length - 1]);
    const [themes, setThemes] = useState([...(notesDB[noteKey]?.themes)]);
    const [options, setOptions] = useState([...themesDB]);
    const [inpTextValue, setInpText] = useState("");
    const [saveVersion, setSaveVersion] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [likeDone, setLikeDone] = useState(false);
    const [sharingImage, setSharingImage] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEditMode = () => {
        setEditMode(true);
    };
    const handleDelete = () => {
        dispatch(deleteNote({ nid: noteKey }));
    };
    const handleArchive = () => {
        dispatch(archiveNote({ nid: noteKey }));
    };
    const handleLike = () => {
        if (likeDone === false)
            dispatch(likeNote({ nid: noteKey }));
        setLikeDone(true);
    };
    const handleRestore = () => {
        dispatch(restoreNote({ nid: noteKey }));
    };
    const handleUnArchive = () => {
        dispatch(unArchiveNote({ nid: noteKey }));
    };
    const handleCancelEdit = () => {
        setEditMode(false);
        setTitle(notesDB[noteKey]?.title[notesDB[noteKey].title.length - 1]);
        setNote(notesDB[noteKey]?.note[notesDB[noteKey].note.length - 1]);
        setThemes([...(notesDB[noteKey]?.themes)]);
        setSaveVersion(false);
        setDisabled(false);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setDisabled(true);
        if (title.trim() === '') {
            setErrorMessage('Title cannot be empty');
            setDisabled(false);
            return false;
        } else if (note.trim() === '') {
            setErrorMessage('Note cannot be empty');
            setDisabled(false);
            return false;
        } else if (themes.length < 1) {
            setErrorMessage('Themes cannot be empty');
            setDisabled(false);
            return false;
        } else {
            setErrorMessage('');
        }
        let data = {
            title: title.trim(),
            note: note.trim(),
            themes,
            nid: noteKey,
            saveVersion
        }
        dispatch(editNote(data));
        setEditMode(false);
        setDisabled(false);
    };

    const handleOptionType = (e) => {
        if (e.target.value !== null) {
            const lowerCaseValue = e.target.value.toLowerCase().trim();
            setInpText(lowerCaseValue);
        }
    }
    const handleOptionChange = (e) => {
        if (e.target.value.trim() !== '') {
            if (e.key === "Enter") {
                if (!options.includes(e.target.value)) {
                    setOptions(
                        (prev) => [...prev, e.target.value],
                    )
                } else {
                    if (!themes.includes(e.target.value)) {
                        setThemes(
                            (prev) => [...prev, e.target.value],
                        )
                        setInpText('');
                    }
                }
            }
        }
    }

    const formattedText = (text) => {
        let formattedText = text;
        let textArray = text.split('\n');
        const newTextArray = [];
        for (let i = 0; i < textArray.length; i++) {
            let textStr = textArray[i];

            var replaced;
            if (textStr.startsWith('- ')) {
                replaced = '<ul><li>' + textStr.replace('- ', '') + '</li>';
                while (textArray[i + 1]?.startsWith('- ')) {
                    i++;
                    replaced += '<li>' + textArray[i].replace('- ', '') + '</li>';
                }
                replaced += '</ul>';
            } else if (textStr.startsWith('> ')) {
                replaced = '"' + textStr.replace('> ', '') + '"';
            } else {
                replaced = textStr;
            }
            replaced = replaced.replace(/_([^_]+)_/g, '<i>$1</i>');
            replaced = replaced.replace(/\*([^*]+)\*/g, '<b>$1</b>');
            replaced = replaced.replace(/~([^~]+)~/g, '<s>$1</s>');
            replaced = replaced.replace(/`([^`]+)`/g, '<code>$1</code>');
            newTextArray.push(replaced);
        }
        formattedText = newTextArray.join('<br />');
        return <div style={{ textAlign: 'left' }} key={Math.random()} dangerouslySetInnerHTML={{ __html: formattedText }} />;
    };

    const handleImageShare = async () => {
        setSharingImage(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const canvas = await html2canvas(noteCardRef.current);
            const imageUrl = canvas.toDataURL('image/png');
            const blob = await (await fetch(imageUrl)).blob();
            const file = new File([blob], 'noteCardImage.png', { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Pranay Notes',
                    text: 'Check out this note!',
                    files: [file],
                });
                console.log('Successfully shared');
            } else {
                navigator.clipboard.writeText(imageUrl);
            }
        } catch (error) {
            console.error('Error sharing image:', error.message);
        } finally {
            setSharingImage(false);
        }
    };

    return (
        <Card ref={noteCardRef} sx={{ width: '90vw', maxWidth: '350px', padding: '5px', borderRadius: 1 }} key={noteKey}>
            <CardContent >

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {editMode ?
                    <>

                        <TextField
                            margin="normal"
                            label="Title"
                            id="outlined-required"
                            required
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoComplete="off"
                        />
                        <TextField
                            multiline
                            margin="normal"
                            label="Note"
                            id="outlined-required"
                            required
                            fullWidth
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            autoComplete="off"
                        />
                        <FormControlLabel control={
                            <Checkbox
                                checked={saveVersion}
                                onChange={(e) => setSaveVersion(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />} label="Save as new version" />
                        <Autocomplete
                            value={themes}
                            onChange={(e, selectedObject) => {
                                if (selectedObject !== null) {
                                    setThemes(selectedObject);
                                }
                            }}
                            multiple
                            fullWidth
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={options}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        value={inpTextValue}
                                        onChange={handleOptionType}
                                        onKeyDown={handleOptionChange}
                                        label="Themes"
                                        placeholder="Add Themes"
                                    />
                                );
                            }}
                        />
                        <br />
                    </>
                    :
                    <>
                        <h2>{title}</h2>
                        {formattedText(note)}
                        <br />
                        {themes.map((theme, index) => (
                            <Chip sx={{
                                margin: 1,
                            }} label={theme} key={index} />
                        ))}

                    </>}
                <br />
                <div>
                    {editMode === false ? (
                        sharingImage ?
                            <>
                                <Tooltip title="Liked">
                                    <Button
                                        sx={{
                                            borderRadius: 6,
                                        }}
                                        onClick={handleLike}
                                        color="error">
                                        <FavoriteIcon />
                                        <span>{notesDB[noteKey]?.likes}</span>
                                    </Button>
                                </Tooltip>
                            </>
                            :
                            <>
                                <Tooltip title={likeDone ? "Liked" : "Like"}>
                                    <Button
                                        sx={{
                                            borderRadius: 6,
                                        }}
                                        onClick={handleLike}
                                        color="error">
                                        {likeDone ? <FavoriteIcon /> : <FavoriteBorderIcon />}<span>{notesDB[noteKey]?.likes}</span>
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Share Image">
                                    <IconButton
                                        onClick={handleImageShare}
                                    >
                                        <ImageIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="More">
                                    <IconButton
                                        onClick={handleClick}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                            </>)
                        :
                        <>
                            <IconButton onClick={handleSubmit} disabled={disabled}>
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelEdit} disabled={disabled}>
                                <CancelIcon />
                            </IconButton>

                        </>
                    }
                </div>
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
                    {(editMode === false && (!(notesDB[noteKey]?.isDeleted)) && (!(notesDB[noteKey]?.isArchived))) &&
                        <MenuItem onClick={handleEditMode}>
                            <ListItemIcon>
                                <EditIcon fontSize="small" />
                            </ListItemIcon>
                            Edit
                        </MenuItem>
                    } {(editMode === false && (!(notesDB[noteKey]?.isDeleted)) && (!(notesDB[noteKey]?.isArchived))) &&
                        <Divider />
                    }
                    {(!(notesDB[noteKey]?.isDeleted)) && (
                        notesDB[noteKey]?.isArchived ?
                            <MenuItem onClick={handleUnArchive}>
                                <ListItemIcon>
                                    <UnarchiveIcon fontSize="small" />
                                </ListItemIcon>
                                UnArchive
                            </MenuItem> :
                            <MenuItem onClick={handleArchive}>
                                <ListItemIcon>
                                    <ArchiveIcon fontSize="small" />
                                </ListItemIcon>
                                Archive
                            </MenuItem>
                    )
                    }

                    {(!(notesDB[noteKey]?.isArchived)) &&
                        (notesDB[noteKey]?.isDeleted ?
                            <MenuItem onClick={handleRestore}>
                                <ListItemIcon>
                                    <RestoreIcon fontSize="small" />
                                </ListItemIcon>
                                Restore
                            </MenuItem> :
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <DeleteIcon fontSize="small" />
                                </ListItemIcon>
                                Delete
                            </MenuItem>
                        )
                    }
                </Menu>
            </CardContent>
        </Card>
    );
}

const NotesList = () => {
    const notesDB = useSelector((state) => state.notesDB.notes) || {};
    const themesDB = useSelector((state) => state.notesDB.allThemes) || [];

    const [filterThemes, setFilterThemes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortAnchorEl, setSortAnchorEl] = useState('desc: likes');
    const [showArchived, setShowArchived] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [allThemes, setAllThemes] = useState(true);

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

    return (
        <div style={{
            margin: '15px 0px', height: 'fit-content',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
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
                    {filteredNotes.map((noteKey) => (
                        <NoteCard noteKey={noteKey} key={noteKey} />
                    ))}
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
                <MenuItem onClick={() => setSortAnchorEl('asc:time')}>
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
                <Divider />
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
        </div>
    );
};

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
