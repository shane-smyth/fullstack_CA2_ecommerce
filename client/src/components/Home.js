import React, { Component } from "react"
import { Link } from "react-router-dom"
import DisplayAllProducts from "./DisplayAllProducts"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"


export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products`)
            .then(res => {
                if (res.data) {
                    this.setState({products: res.data})
                }
                else {
                    console.log("Records not found.")
                }
            })
    }

    render() {
        return (
            <div>
                <div className="hero">
                    <div className="heroDescription grids">
                        <div className="heroDescriptionBox grids">
                            <h1>The Music Shop</h1>
                            <h3>Rock Your World. Loud and Clear.</h3>
                            <p>Discover the ultimate gear for your music journey-electric guitars,
                                drum kits, amps, pedals, and everything in between. From stage-ready
                                essentials to pro-level accessories, we’ve got everything you need
                                to keep the music alive.</p>
                            <h3>Unleash Your Sound. Shop Now.</h3>
                        </div>
                    </div>
                    <div className="heroImage grids">
                        <img src="./images/hero-image.png" alt="hero image"/>
                    </div>
                    <div className="heroButton grids">
                        <div className="heroShopButton">
                            <Link to="/shop">
                                <p>Shop</p>
                            </Link>
                        </div>
                    </div>
                </div>

                <body>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At corporis ducimus eum exercitationem,
                        ipsa iste iure, nesciunt nulla, quidem sapiente temporibus velit! Aperiam maxime neque officia,
                        officiis quas sed voluptatum?</p>

                    <DisplayAllProducts />
                </body>
            </div>
        )
    }
}
