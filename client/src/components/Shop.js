import React, { Component } from "react"
import axios from "axios"
import DisplayAllProducts from "./DisplayAllProducts"
import {SERVER_HOST} from "../config/global_constants";

export default class Shop extends Component {
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
                    this.setState({ products: res.data })
                }
                else {
                    console.log("Records not found.")
                }
            })
    }

    render() {
        let {products} = this.state

        return (
            <div className="shop boxes">
                <div className="shopHeader boxes">
                    <h2>SHOP</h2>
                </div>

                <div className="shopFilters boxes">
                    <h2>FILTERS</h2>
                </div>

                <div className="shopProducts boxes">
                    <DisplayAllProducts products={products} />
                </div>
            </div>
        )
    }
}