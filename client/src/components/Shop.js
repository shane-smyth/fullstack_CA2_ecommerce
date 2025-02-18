import React, { Component } from "react"
import axios from "axios"
import FilterProducts from "./FilterProducts"
import DisplayAllProducts from "./DisplayAllProducts"
import {SERVER_HOST} from "../config/global_constants"
import queryString from "query-string" // https://www.npmjs.com/package/query-string

const cleanSearch = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "")
}

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
                    this.setState({
                        products: res.data
                    })
                }
                else {
                    console.log("Records not found.")
                }
            })
    }

    render() {
        let { products } = this.state

        const { location } = this.props
        const { search , category, brand} = location ? queryString.parse(location.search) : {}

        if (search) {
            const searchProduct = cleanSearch(search)

            products = products.filter(
                (product) =>
                    cleanSearch(String(product.name)).includes(searchProduct) ||
                    cleanSearch(String(product.description)).includes(searchProduct) ||
                    cleanSearch(String(product.category)).includes(searchProduct) ||
                    cleanSearch(String(product.subcategory)).includes(searchProduct) ||
                    cleanSearch(String(product.brand)).includes(searchProduct)
            )
        }

        if (brand) {
            products = products.filter(product => product.brand === brand)
        }
        if (category) {
            products = products.filter(product => product.category === category)
        }

        return (
            <div className="shop boxes">
                <div className="shopHeader boxes">
                    <h2>SHOP</h2>
                </div>

                <div className="shopFilters boxes">
                    {/*<h2>FILTERS</h2>*/}
                    {/*<FilterProducts/>*/}
                    <FilterProducts selectedCategory={category || ""}/>
                </div>

                <div className="shopProducts boxes">
                    <DisplayAllProducts products={products} />
                </div>
            </div>
        )
    }
}