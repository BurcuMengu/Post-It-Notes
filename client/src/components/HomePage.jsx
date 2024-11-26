import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

function HomePage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return(
        <div className="header">
            <img src={logo} alt="Logo" className="img"/>
            <div className="button-container">
                <button onClick={handleLogin} className="button">Login</button>
                <button onClick={handleSignUp} className="button">Sign Up</button>
            </div>
        </div>
    );
}

export default HomePage;