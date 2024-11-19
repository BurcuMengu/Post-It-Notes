import React from "react";
import logo from "../assets/logo.png"

function Header() {
    return(
        <header>
            <div>
                <img src={logo} alt="Logo" />
                <button>Login</button>
                <button>Sign Up</button>
            </div>
        </header>
    );
}

export default Header;