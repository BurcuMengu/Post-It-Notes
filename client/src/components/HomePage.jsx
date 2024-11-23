import React from "react";
import { useHistory } from "react-router-dom";
import logo from "../assets/logo.png"
import SignUp from "./SignUp";
import Login from "./Login";

function HomePage() {
    const history = useHistory();

    const handleLogin = () => {
        history.push("/login");
    };

    const handleSignUp = () => {
        history.push("/signup");
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