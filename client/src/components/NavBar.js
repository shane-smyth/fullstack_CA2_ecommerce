import React, {Component} from "react"
import {Link} from "react-router-dom"

import SearchBar from "./SearchBar.js"
import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"

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
                        <Link to="/" className="navMenuLinkP">
                            <p>Home</p>
                        </Link>
                        <Link to="/shop" className="navMenuLinkP">
                            <p>Shop</p>
                        </Link>

                        {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                            <Link to="/adminPage" className="navMenuLinkP">
                                <p>Admin</p>
                            </Link>
                            :
                            null
                        }

                        <Link to="https://www.w3schools.com/howto/howto_css_searchbar.asp" className="navMenuLink">
                            <img src="./images/shopping-cart.png" alt="shopping basket logo"/>
                        </Link>

                        {Number(localStorage.accessLevel) > ACCESS_LEVEL_GUEST ?
                            <Link to="/account" className="navMenuLink">
                                <img src="./images/user.png" alt="user logo"/>
                            </Link>
                            :
                            <Link to="/login" className="navMenuLink">
                                <img src="./images/user.png" alt="user logo"/>
                            </Link>
                        }
                    </div>
                </div>
            </nav>
        )
    }
}
