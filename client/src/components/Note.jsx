import React, { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../api.js';  // api.js dosyasındaki fonksiyonları import et

function Note() {
    const [notes, setNotes] = useState([]);

    // When the component is mounted, fetch notes from the server
    useEffect(() => {
        getNotes()  // api.js'deki getNotes fonksiyonunu kullan
            .then(data => setNotes(data))  // Set notes to the state
            .catch(error => console.error('Error fetching notes:', error));
    }, []);

    // Function to handle note deletion
    const handleDelete = (id) => {
        deleteNote(id)  // api.js'deki deleteNote fonksiyonunu kullan
            .then(() => {
                // Update the state by removing the deleted note
                setNotes(notes.filter(note => note.id !== id)); 
            })
            .catch(error => console.error('Error deleting note:', error));
    };

    return (
        <div className="noteHeader">
            <h2>Your Notes</h2>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>
                        {note.content} 
                        <button className="buttonNote" onClick={() => handleDelete(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Note;
