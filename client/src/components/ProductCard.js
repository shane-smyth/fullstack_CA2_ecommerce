import React, {Component, createRef} from "react"
import {Link} from "react-router-dom"
import Toast from "./Toast"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"


export default class ProductCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productImages: {},
        }

        this.toastRef = createRef() //https://legacy.reactjs.org/docs/refs-and-the-dom.html
    }

    componentDidMount() {
        const { products } = this.props

        if (products && products.length > 0) {
            this.fetchProductImages(products)
        }
    }

    fetchProductImages = (products) => {
        products.forEach(product => {
            if (product.images && product.images.length > 0) {
                product.images.forEach(image => {
                    axios.get(`${SERVER_HOST}/products/photo/${image.filename}`)
                        .then(res => {
                            if (res.data) {
                                if (res.data.errorMessage) {
                                    console.log(res.data.errorMessage)
                                } else {
                                    // Update the productImages state with the fetched image
                                    this.setState(prevState => ({
                                        productImages: {
                                            ...prevState.productImages,
                                            [image.filename]: `data:;base64,${res.data.image}`
                                        }
                                    }))
                                }
                            } else {
                                console.log("Image not found")
                            }
                        })
                        .catch(err => {
                            this.toastRef.current.showError(
                                err.response.data.errorMessage || "Error fetching product images"
                            )
                        })
                })
            }
        })
    }

    render() {
        const { products } = this.props

        return (
            <div className="productCardBox">
                {products.map((product, index) => (
                    <Link to={`/shop/productPage/${product._id}`} key={index}>
                        <div key={index} className="cardBody">
                            <div className="productCardImg">
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={this.state.productImages[product.images[0].filename]}
                                        alt={`image of ${product.name}`}
                                    />
                                )}
                            </div>
                            <div className="productDetails">
                                <h4>{product.name}</h4>
                                <div className="starsBox"></div>
                                <ul>
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
                <Toast ref={this.toastRef} />
            </div>
        )
    }
}
