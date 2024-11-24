import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import HomePage from "./HomePage";
import Note from "./Note";
import SignUp from "./SignUp";
import Login from "./Login";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
                <Route path="/notes" component={Note} />
            </Switch>
            <Footer />
        </Router>
    );
  }



export default App;