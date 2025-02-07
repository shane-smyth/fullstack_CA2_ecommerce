import React, { Component } from "react"
import { Link } from "react-router-dom"
import Shop from "./Shop.js"
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
                    <div className="heroImage grids">
                        <img src="./images/hero-image.png" alt="hero image"/>
                    </div>
                    <div className="heroHeader grids">
                        <h1>The Music Shop</h1>
                    </div>
                    <div className="heroDescription grids">
                        <h3>Rock Your World. Loud and Clear.</h3>
                        <p>Discover the ultimate gear for your music journey-electric guitars,
                            drum kits, amps, pedals, and everything in between. From stage-ready
                            essentials to pro-level accessories, we’ve got everything you need
                            to keep the music alive.</p>
                        <h3>Unleash Your Sound. Shop Now.</h3>
                    </div>
                    <div className="heroButton grids">
                        <button className="heroShopButton">
                            <Link to="/shop">
                                <p>Shop</p>
                            </Link>
                        </button>
                    </div>
                </div>

                <div>
                    
                </div>
            </div>
        )
    }
}
