import React, { Component } from "react";
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
// import ProductCard from "./ProductCard";

export default class Test extends Component {

    constructor(props) {
        super(props)

        this.state = {
            brands: [],
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/brands`)
            .then(res => {
                if (res.data) {
                    this.setState({ brands: res.data })
                }
                else {
                    console.log("Brands not found.")
                }
            })
    }

    render() {
        return (
            <div className="allBrandsContainer">
                <ul>
                    {this.state.brands.map((brand, index) => (
                        <li key={index}>
                            <a><img src={`/images/${brand.toLowerCase()}.png`} alt={brand}/></a>
                            <p>{brand}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}