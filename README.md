Post-It Notes
Description

A simple Post-It Notes application that allows users to create, edit, and delete notes. The application consists of a client-side user interface and a server-side backend to handle note data storage and retrieval.
Features

    Create new notes
    Edit existing notes
    Delete notes
    Responsive design for all devices

Technologies Used

    Client: HTML, CSS, JavaScript
    Server: Node.js, Express.js
    Database: (PostgreSQL)

Installation
Prerequisites

    Node.js and npm installed on your machine.

Client Setup

    Clone the repository:

git clone https://github.com/BurcuMengu/Post-It-Notes.git

Navigate to the client directory:

cd Post-It-Notes/client

Install dependencies:

    npm install

Server Setup

    Navigate to the server directory:

cd Post-It-Notes/server

Install dependencies:

npm install

Run the server:

    npm start

Client Usage

After the server is running, open your browser and navigate to http://localhost:3000 to start using the Post-It Notes application.
API Documentation (If applicable)
Endpoints

    GET /notes: Retrieve all notes.
    POST /notes: Create a new note.
    PUT /notes/:id: Edit a note.
    DELETE /notes/:id: Delete a note.

Contributing

    Fork the repository.
    Create a new branch (git checkout -b feature/your-feature).
    Commit your changes (git commit -am 'Add new feature').
    Push to the branch (git push origin feature/your-feature).
    Create a new Pull Request.


License

This project is licensed under the MIT License - see the LICENSE file for details.
