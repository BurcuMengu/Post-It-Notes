import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import HomePage from "./HomePage";
import Note from "./Note";
import SignUp from "./SignUp";
import Login from "./Login";
import GoogleCallback from "./GoogleCallback";

function App() {
    const [user, setUser] = useState(null);  // Store the user in state

    // Check login status when the page loads.
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/check-session', { withCredentials: true });
                setUser(response.data.user);  // Store the logged-in user in state
            } catch (error) {
                console.log("No user logged in.");
            }
        };

        checkLoggedIn(); // Check login status when the page loads
    }, []);
    
    // Set up WebSocket connection when the component mounts
    useEffect(() => {
        if (user) {
            const ws = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server URL

            ws.onopen = () => {
                console.log('WebSocket connection opened.');
                ws.send(JSON.stringify({ type: 'authenticate', userId: user.id }));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
                console.log('New message received:', message);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed.');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            // Save the WebSocket connection to state
            setSocket(ws);

            return () => {
                // Cleanup WebSocket connection when the component unmounts
                if (ws) {
                    ws.close();
                }
            };
        }
    }, [user]); // WebSocket connection is established only when a user is logged in


    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/notes"
                    element={user ? <Note user={user} /> : <Navigate to="/login" />} // Redirect non-logged-in users to the login page
                />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
