import React, { Component } from "react";
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import ProductCard from "./ProductCard";

export default class DisplayAllProducts extends Component {

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
        return (
            <div className="allProductsContainer">
                <ProductCard products={this.state.products}/>
            </div>
        )
    }
}
