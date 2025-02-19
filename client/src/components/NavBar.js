import React, {Component} from "react"
import {Link} from "react-router-dom"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import SearchBar from "./SearchBar.js"

export default class NavBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav>
                <div className="navLogo navBoxes">
                    <div className="logoContent">
                        <Link to="/">
                            <p>The Music Shop</p>
                        </Link>
                    </div>
                </div>

                <div className="navSearch navBoxes">
                    <SearchBar/>
                </div>

                <div className="navMenu navBoxes">
                    <div className="menuIcons">
                        <Link to="https://www.w3schools.com/howto/howto_css_searchbar.asp" className="navMenuLink">
                            <img src="./images/shopping-cart.png" alt="shopping basket logo"/>
                        </Link>
                        <Link to="" className="navMenuLink">
                            <img src="./images/user.png" alt="user logo"/>
                        </Link>
                    </div>
                </div>
            </nav>
        )
    }
}