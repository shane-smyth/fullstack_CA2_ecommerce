import React, { Component } from "react" 
import axios from "axios" 
import { SERVER_HOST } from "../config/global_constants"
import { Link } from "react-router-dom"

export default class Categories extends Component {
    
    constructor(props) {
        super(props) 

        this.state = {
            products: [],
            categories: [],
        } 
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products`)
            .then((res) => {
                if (res.data) {
                    const products = res.data 
                    const categories = [...new Set(products.map((product) => product.category))] 

                    this.setState({
                        products,
                        categories,
                    }) 
                } 
                else {
                    console.log("Records not found.") 
                }
            }) 
    }

    render() {
        const { categories } = this.state

        return (
            <div className="categoryDisplay">
                <h2>Our Categories</h2>
                <div className="categories">
                    {categories.map((category) => (
                        <Link
                             key={category}
                             className="category"
                             // to={`/shop?brand=${brand}`}
                            to={`/shop?category=${encodeURIComponent(category)}`} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
                        >
                            <div className="categoryName">{category}</div>
                            <img src={`/images/${category.toLowerCase()}.jpg`} className="categoryImage" alt={category}/>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}