import React, { Component } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { SERVER_HOST } from "../config/global_constants"

export default class ProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: [],
            productImages: {},
            slideIndex: 1,
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products/${this.props.match.params.id}`)
            .then(res => {
                if (res.data) {
                    this.setState({
                        product: res.data
                    }, () => {this.fetchProductImages(res.data)})
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.errorMessage || "Error fetching product", {
                    position: "bottom-right",
                })
            })
    }

    fetchProductImages = (product) => {
        const images = product.images || [] // Ensure images is an array
        if (images.length > 0) {
            images.forEach(image => {
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
                        toast.error(err.response?.data?.errorMessage || "Error fetching product image", {
                            position: "bottom-right",
                        })
                    })
            })
        }
    }

    plusDivs = (n) => {
        this.showDivs(this.state.slideIndex + n)
    }

    showDivs = (n) => {
        const images = this.state.product.images || []
        let newIndex = n

        if (n > images.length) {
            newIndex = 1
        }
        if (n < 1) {
            newIndex = images.length
        }

        this.setState({ slideIndex: newIndex })
    }

    render() {
        const { product, productImages, slideIndex } = this.state;

        let specs = product.specifications || []

        return (
            <div className="wholeProductPage">
                <div className="productPage">
                    <div className="productName boxes">
                        <h2>{product.name}</h2>
                    </div>

                    <div className="productImgBox boxes">
                        <div className="imageSlider">
                            {(product.images || []).map((image, index) => (
                                <div
                                    key={index}
                                    className="mySlides"
                                    style={{display: (index + 1) === slideIndex ? "block" : "none"}}
                                >
                                    <img src={productImages[image.filename]} alt={`Product ${index + 1}`}/>
                                </div>
                            ))}
                            <button className="w3-button w3-display-left" onClick={() => this.plusDivs(-1)}>&#10094;</button>
                            <button className="w3-button w3-display-right" onClick={() => this.plusDivs(1)}>&#10095;</button>
                        </div>
                    </div>


                    <div className="productMainBox boxes">
                        <h1>€{product.price}</h1>

                        <h3>{product.description}</h3>

                        {product.stock <= 0 ? <p style={{color: "red"}}>out of stock</p> :
                            <p style={{color: "#28b845"}}>In stock</p>}

                        <div className="productPageAddToBasketBox boxes">
                            <select>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                            </select>

                            <button>
                                <Link>
                                    <p>ADD TO BASKET</p>
                                </Link>
                            </button>
                        </div>
                    </div>

                    <div className="productSpecsBox boxes">
                        <h2>{product.subcategory}</h2>
                        <ul>
                            {/*https://www.geeksforgeeks.org/javascript-object-entries-method/*/}
                            {(product.specifications || []).map((spec, index) => (
                                <li key={index}>
                                    <strong>{spec.key}:</strong> {spec.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        )
    }
}
