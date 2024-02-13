//short-page.js
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import html2canvas from 'html2canvas';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { archiveNote, deleteNote, editNote, likeNote, restoreNote, unArchiveNote } from '../data/store';


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
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

export default function NoteCard({ noteKey, setSnackBar }) {
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
                setSnackBar('Successfully shared');
            } else {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': file })]);
                console.log('Image copied to clipboard');
                setSnackBar('Image copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing image:', error.message);
        } finally {
            setSharingImage(false);
        }
    };

    return (
        <>
            <Card ref={noteCardRef} sx={{ width: '90vw', maxWidth: '350px', padding: '5px', borderRadius: 1, textAlign: 'center' }} key={noteKey}>

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
        </>
    );
}
