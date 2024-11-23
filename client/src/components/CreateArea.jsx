import React, { useState } from 'react';

function CreateArea() {
    const [content, setContent] = useState('');

    // Handle input field change
    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Send POST request to add a new note
        fetch('http://localhost:5000/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }), // Send the note content
            credentials: 'include', // Include session data (cookies)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Note added:', data);
            setContent(''); // Clear the input field after submission
        })
        .catch(error => console.error('Error adding note:', error));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Write your note here..."
                />
                <button type="submit">Add Note</button>
            </form>
        </div>
    );
}

export default CreateArea;
