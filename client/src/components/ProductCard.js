import React, { Component } from "react"
import {Link} from "react-router-dom"


export default class ProductCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { products } = this.props

        return (
            <div className="productCardBox">
                {products.map((product, index) => (
                    <Link to={`/productPage/${product._id}`} key={index}>
                        <div key={index} className="cardBody">
                            <div className="productCardImg">
                                <img
                                    src={product.images[0]}
                                    alt={`image of ${product.name}`}
                                />
                            </div>
                            <div className="productDetails">
                                <h4>{product.name}</h4>
                                <div className="starsBox"></div>
                                <ul>
                                    {/*https://www.geeksforgeeks.org/javascript-object-entries-method/*/}
                                    {product.specifications.map((spec, index) => (
                                        <li key={index}>
                                            <strong>{spec.key}:</strong> {spec.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="productPrice">
                                <h4>€{product.price}</h4>
                                {product.stock <= 0 ? <p style={{color: "red"}}>out of stock</p> :
                                    <p style={{color: "#28b845"}}>in stock</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )
    }
}
