import React, { Component } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/test.css"
import "./css/navBar.css"
import "./css/home.css"
import "./css/displayProducts.css"
import "./css/productPage.css"
import "./css/shop.css"

import Home from "./components/Home.js"
import Footer from "./components/Footer.js"
import Shop from "./components/Shop.js"
import NavBar from "./components/NavBar.js"
import ProductPage from "./components/ProductPage"
import ShoppingCart from "./components/ShoppingCart"


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
                    {/*<Route exact path="/shop/:category/:brand" component={Shop} />*/}
                    {/*<Route path="/shop/:category?/:brand?" component={Shop} />*/}
                    <Route exact path="/productPage/:id" component={ProductPage} />
                    <Route exact path="/cart" component={ShoppingCart} />
                    <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>} />

                </Switch>

                <footer>
                    <Footer />
                </footer>

            </BrowserRouter>
        )
    }
}
