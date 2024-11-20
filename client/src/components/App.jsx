import React, { useState } from "react";
import CreateArea from "./CreateArea";
import Footer from "./Footer";
import HomePage from "./HomePage";
import Note from "./Note";
import SignUp from "./SignUp";
import Login from "./Login";

function App(){
    return (
        <div>
            <Login />
            <SignUp />
            <HomePage />
            <Footer />
        </div>
    )
}


export default App;