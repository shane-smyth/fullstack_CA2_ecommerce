import React, { Component } from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/test.css"
import "./css/navBar.css"
import "./css/home.css"

import Home from "./components/Home.js"
import Main from "./components/Main.js"


export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/home" component={Home}/>
                    <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>}/>
                </Routes>

                <Main/>

            </BrowserRouter>
        )
    }
}