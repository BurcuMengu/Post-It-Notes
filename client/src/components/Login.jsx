import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for error message
    const history = useHistory();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // Logging the user in via the backend
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password
            }, { withCredentials: true });

            console.log("Login successful:", response.data);
            
            // Redirecting to the main page after successful login
            history.push("/notes");
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            // Displaying the error message
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </div>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default Login;
