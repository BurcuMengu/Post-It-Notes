import React from "react";
import logo from "../assets/logo.png"

function Header() {
    return(
        <div className="header">
            <img src={logo} alt="Logo" className="img"/>
            <div className="button-container">
                <button className="button">Login</button>
                <button className="button">Sign Up</button>
            </div>
        </div>
    );
}

export default Header;