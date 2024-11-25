import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios"; // axios imported

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");  // State for first name
    const [lastName, setLastName] = useState("");    // State for last name
    const [error, setError] = useState(""); // State for error message
    const history = useHistory();

    const handleSignUp = async (event) => {
        event.preventDefault();
        
        try {
            // Sending user registration data via Axios to the API
            const response = await axios.post("http://localhost:5000/api/register", {
                email,
                password,
                firstName,
                lastName
            });

            console.log("SignUp successful:", response.data);
            // Redirecting to the notes page after successful registration
            history.push("/notes");
        } catch (error) {
            console.error("SignUp failed:", error.response ? error.response.data : error.message);
            // Displaying error message
            setError("An error occurred during sign up. Please try again.");
        }
    };

    return (
        <div className="signup">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default SignUp;
