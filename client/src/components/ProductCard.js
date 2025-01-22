import React, { Component } from "react"


export default class ProductCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { products } = this.props

        return (
            <div className="productCardBox">
                {products.map((product, index) => (
                    <div key={index} className="cardBody">
                        <img
                            src={product.images[0]}
                            alt={`image of ${product.name}`}
                        />
                        <div className="productDetails">
                            <p className="pBold">{product.name}</p>


                            {product.stock <=0 ? <p style={{color: "red"}}>out of stock</p> : <p style={{color: "#28b845"}}>in stock</p>}
                        </div>
                        <div className="productPrice">
                            <p className="pBold">€{product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
