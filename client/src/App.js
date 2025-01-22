import React, { Component } from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/test.css"

import Home from "./components/Home.js"
import NavBar from "./components/NavBar.js"
import Footer from "./components/Footer.js"


export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <header>
                        <NavBar/>
                    </header>

                    <Routes>
                        <Route exact path="/" component={Home}/>
                        <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>}/>
                    </Routes>

                    <Home/>

                    <footer>
                        <Footer/>
                    </footer>
                </div>
            </BrowserRouter>
        )
    }
}
