import { Button, InputLabel, TextareaAutosize, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { apiCall } from '../utilities';

function Dashboard() {

    const history = useHistory();
    const [user, setUser] = useState({});
    const [toggleForm, setToggleForm] = useState(false);
    const [newNote, setNewNote] = useState({title:'', note:''});

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
            } else {
                localStorage.removeItem('token')
                history.push('/login')
            } 
        });
               
	}, []);




    // Log Out Handler Function
    const handleLogOut = (e) => {
        localStorage.removeItem('token');
        console.log('sign out');
        history.push('/login');
    }

    // Note Handler Function
    const handleNote = (e) => {
        const { name, value} = e.target;
        setNewNote(prevState => ({
            ...prevState,
            [name]:value
        }));
    }

    // addNote Handler Function
    const  addNote = async () => {
        console.log(newNote);
        //console.log();
        const res = await fetch('/api/v1/notes', {
            method: 'POST',
            body : JSON.stringify(newNote),
            headers: {
                'content-type': 'application/json',
                authorization : `Bearer: ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
        .then((note) =>{
            console.log(note)
        })
    }
    
    


    return (
        <div>
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
            
        </div>
    )
}

export default Dashboard
