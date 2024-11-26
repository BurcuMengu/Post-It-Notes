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
