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
                    const specificBrands = ["casio", "fender", "gibson", "yamaha", "pearl"]
                    const filteredBrands = res.data.filter(brand => specificBrands.includes(brand.toLowerCase()))
                    this.setState({
                        brands: filteredBrands
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
                    {this.state.brands.map((brand, index) => (
                        <li key={index}>
                            {/*to={`/shop/brand/${brand}`}>*/}
                            <Link to={`/shop?brand=${encodeURIComponent(brand)}`}>
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