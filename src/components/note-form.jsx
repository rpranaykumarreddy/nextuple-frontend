//short-page.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '../data/store';


import Alert from '@mui/material/Alert';
import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

export default function NoteForm({ onClose }) {
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
