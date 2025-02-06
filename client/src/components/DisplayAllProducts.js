import React, { Component } from "react";
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import ProductCard from "./ProductCard";

export default class DisplayAllProducts extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="allProductsContainer">
                <ProductCard products={this.props.products}/>
            </div>
        )
    }
}
