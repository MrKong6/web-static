import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import "bootstrap/dist/js/bootstrap"

import Home from "../Home/Home";
import Login from '../Login/Login'

const App = () => (
    <Router>
        <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/login' component={Login}/>
            <Route path='/home' component={Home}/>
        </Switch>
    </Router>
);

export default App;