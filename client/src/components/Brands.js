import React, { Component } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import { Link } from "react-router-dom"

export default class Brands extends Component {

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
                    this.setState({
                        brands: res.data
                    })
                }
                else {
                    console.log("Brands not found.")
                }
            })
    }

    render() {
        return (
            <div className="allBrandsContainer">
                <h2>Brands Offered</h2>
                <ul>
                    {this.state.brands.slice(0,5).map((brand, index) => (
                        <li key={index}>
                            <Link
                                // to={`/shop/brand/${brand}`}>
                                to={`/shop?brand=${encodeURIComponent(brand)}`}
                            >
                                <img src={`/images/${brand.toLowerCase()}.png`} alt={brand}/>
                                <p>{brand}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link to="/shop">
                    <p>.. and many more !</p>
                </Link>
            </div>
        )
    }
}