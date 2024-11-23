import React, { useEffect, useState } from 'react';

function Note() {
    const [notes, setNotes] = useState([]);

    // When the component is mounted, fetch notes from the server
    useEffect(() => {
        fetch('http://localhost:5000/api/notes', {
            credentials: 'include', // To include session data (cookies)
        })
        .then(response => response.json())
        .then(data => setNotes(data)) // Store fetched notes in the state
        .catch(error => console.error('Error fetching notes:', error));
    }, []);

    // Function to handle note deletion
    const handleDelete = (id) => {
        fetch(`http://localhost:5000/api/notes/${id}`, {
            method: 'DELETE', // DELETE request to remove the note
            credentials: 'include', // Include session data (cookies)
        })
        .then(() => {
            // Update the state by removing the deleted note
            setNotes(notes.filter(note => note.id !== id)); 
        })
        .catch(error => console.error('Error deleting note:', error));
    };

    return (
        <div>
            <h2>Your Notes</h2>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>
                        {note.content} 
                        <button onClick={() => handleDelete(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Note;
