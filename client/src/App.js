import React, { Component } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/test.css"
import "./css/app.css"
import "./css/navBar.css"
import "./css/home.css"
import "./css/displayProducts.css"
import "./css/productPage.css"
import "./css/shop.css"
import "./css/adminPage.css"
import "./css/displayUsers.css"
import "./css/account.css"

import Home from "./components/Home.js"
import Footer from "./components/Footer.js"
import Shop from "./components/Shop.js"
import NavBar from "./components/NavBar.js"
import ProductPage from "./components/ProductPage"
import LoggedInRoute from "./components/LoggedInRoute"
import AdminRoute from "./components/AdminRoute"
import Login from "./components/Login"
import Register from "./components/Register"
import Account from "./components/Account"
import AdminPage from "./components/AdminPage"

import {ACCESS_LEVEL_GUEST} from "./config/global_constants"



if (typeof localStorage.accessLevel === "undefined") {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
    localStorage.pfp = null
}


export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <header>
                    <NavBar />
                </header>

                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exaxt path="/home" component={Home} />
                    <Route exact path="/shop" component={Shop} />
                    <Route exact path="/shop/productPage/:id" component={ProductPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <LoggedInRoute exact path="/account" component={Account} />
                    <AdminRoute exact path="/adminPage" component={AdminPage} />
                    <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>} />

                </Switch>

                <footer>
                    <Footer />
                </footer>

            </BrowserRouter>
        )
    }
}
