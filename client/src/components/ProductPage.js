import React, { Component } from "react"
import axios from "axios"
import {Link, Redirect} from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants";

export default class ProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: [],
            productImages: {},
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
    }

    fetchProductImages = (product) => {
        const images = product.images || []; // Ensure images is an array
        if (images.length > 0) {
            images.forEach(image => {
                axios.get(`${SERVER_HOST}/products/photo/${image.filename}`)
                    .then(res => {
                        if (res.data) {
                            if (res.data.errorMessage) {
                                console.log(res.data.errorMessage);
                            } else {
                                // Update the productImages state with the fetched image
                                this.setState(prevState => ({
                                    productImages: {
                                        ...prevState.productImages,
                                        [image.filename]: `data:;base64,${res.data.image}`
                                    }
                                }));
                            }
                        } else {
                            console.log("Image not found");
                        }
                    })
                    .catch(err => {
                        console.error("Error fetching image:", err);
                    });
            });
        }
    };

    render() {
        const { product, productImages } = this.state
        console.log(product)

        let specs = product.specifications || []

        return (
            <div className="wholeProductPage">
                <div className="productPage">
                    <div className="productName boxes">
                        <h2>{product.name}</h2>
                    </div>


                    <div className="productImgBox boxes">
                        {(product.images || []).map((image, index) => (
                            <img
                                src={productImages[image.filename]}
                                key={index}
                                alt={`Product image ${index + 1}`}
                            />
                        ))}
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

                <div className="otherProducts boxes">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    A alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                    alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    A alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                    alias animi blanditiis consequuntur
                    debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis, perspiciatis
                    quam quia quidem quo voluptatem.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias animi blanditiis consequuntur
                        debitis exercitationem expedita fugiat iusto laborum magni modi neque, non officiis,
                        perspiciatis
                        quam quia quidem quo voluptatem.</p>

                </div>
            </div>
        )
    }
}
