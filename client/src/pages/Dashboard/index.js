import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import MDemoji from 'markdown-it-emoji';
import './style.css';



function Dashboard() {

    const history = useHistory();
    const [user, setUser] = useState({});
    const [toggleForm, setToggleForm] = useState(false);
    const [newNote, setNewNote] = useState({title:'', note:''});
    const [notesList, setNotesList] = useState([]);
    const md = new MarkdownIt();
    md.use(MDemoji);


    const API_URL = 'http://localhost:1337/world'

    useEffect(() => {
        fetch(API_URL , {
            headers :{
                authorization : `Bearer: ${localStorage.getItem('token')}`
            }
        }).then((res) => res.json())
        .then((result) => {
            if(result.user){
              setUser(result.user)
              getNotes();
            } else {
                localStorage.removeItem('token')
                history.push('/login')
            } 
        });
               
	}, []);

    // Log Out Handler Function
    function handleLogOut() {
        localStorage.removeItem('token');
        console.log('sign out');
        history.push('/login');
    }

    // Note Handler Function
    function handleNote(e) {
        const { name, value } = e.target;
        setNewNote(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // addNote Handler Function
    async function addNote() {
        //console.log();
        await fetch('/api/v1/notes', {
            method: 'POST',
            body: JSON.stringify(newNote),
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer: ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then((note) => {
                setNotesList([...notesList, note]);
                //console.log(notesList);
                setNewNote({ title: '', note: '' });
                setToggleForm(false);
            });
    }
    
    // addNote Handler Function
    async function getNotes() {
        await fetch('/api/v1/notes', {
            headers: {
                authorization: `Bearer: ${localStorage.getItem('token')}`
            },
        }).then((res) => res.json())
            .then((notes) => {
                setNotesList(notes);

            });
    }

    // Function to render Note with Markdown
    //Broken fix later
    // function renderMarkDown(note) {
    //     let html =md.render(note)
    //     console.log(html)
    //     return { __html: html };
    // }
    


    return (
        <div >
            <h1>Dashboard</h1>
            <Button
            variant='contained'
            color='secondary'
            onClick={handleLogOut}
            type='submit'
            >Log Out</Button>
            <br/>
            <Button
            variant='contained'
            color='primary'
            onClick={() => setToggleForm(!toggleForm)}
            type=""
            >Toggle Form</Button>
            <h1>Hello {user.email} 👋</h1>
            {toggleForm ? <form>
            <TextField
                variant="standard"
                margin="normal"
                fullWidth
                required
                value={newNote.title}
                onChange={handleNote}
                id="title"
                name="title"
                label="Title"
                type="text"
                placeholder="Enter a title."
                helperText="Enter a descriptive title for your note."
            />
            <TextField
                variant="standard"
                margin="normal"
                fullWidth
                multiline
                required
                value={newNote.note}
                onChange={handleNote}
                id="note"
                name="note"
                label="Note"
                type="text"
                placeholder="Enter your note."
                //helperText="Enter a descriptive note."
            />
            <Button
            variant='contained'
            color="primary"
            onClick={addNote}
            disabled={!(newNote.title.length > 0 && newNote.note.length > 0)}
            >Add note</Button>

            </form> : <h1>Toggle to write note</h1>}

            
            <div className='card-wrapper'>
            {user ? notesList.map((note) => 
                <Card key={note._id} className='card'>
                    <CardContent className='card-content'>
                    <Typography color="textSecondary" gutterBottom>
                        {note.title}
                    </Typography>
                    <Typography variant='h6' component="h5">
                    {note.note}  
                    </Typography>
                    </CardContent>
                </Card>
            ):""}
            </div>
            
        </div>
    )
}

export default Dashboard
