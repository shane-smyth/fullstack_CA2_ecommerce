import React, { Component } from "react"
import axios from "axios"
import {Link, Redirect} from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants"  

export default class ProductPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            product: [],
            quantity: 1,
            showOutOfStockModal: false, 
            showQuantityLimitModal: false,
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products/${this.props.match.params.id}`)
            .then(res => {
                if (res.data) {
                    this.setState({
                        product: res.data
                    })
                }
            })
    }

    handleAddToCart = () => {
        const { product , quantity } = this.state

        if (product.stock <= 0) {
            // console.log("out of stock showing modal")  
            this.setState({ 
                showOutOfStockModal: true 
            })  
            return  
        }

        if (quantity > product.stock) {
            // console.log("over stock showing modal")  
            this.setState({   
                showQuantityLimitModal: true 
            })  
            return  
        }

        this.props.history.push({
            pathname: "/cart",
            state: { product , quantity },
        })
    }

    handleQuantityChange = (e) => {
        this.setState({
            quantity: parseInt(e.target.value)
        })
    }

    closeOutOfStockModal = () => {
        this.setState({ showOutOfStockModal: false })  
    }  

    closeQuantityLimitModal = () => {
        this.setState({   showQuantityLimitModal: false })  
    }  

    render() {
        const { product, quantity, showOutOfStockModal,   showQuantityLimitModal } = this.state
        // console.log(product)

        let specs = product.specifications || []

        return (
            <div className="wholeProductPage">
                <div className="productPage">
                    <div className="productName boxes">
                        <h2>{product.name}</h2>
                    </div>
                    <div className="productImgBox boxes">
                        <img src={product.images} alt=""/>
                    </div>

                    <div className="productMainBox boxes">
                        <h1>€{product.price}</h1>
                        <h3>{product.description}</h3>

                        {product.stock <= 0 ? <p style={{color: "red"}}>Out of stock</p> :
                            <p style={{color: "#28b845"}}>In stock</p>}

                        <div className="productPageAddToBasketBox boxes">
                            <select
                                value={quantity}
                                onChange={this.handleQuantityChange}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>

                            <button onClick={this.handleAddToCart}>
                                    <p>ADD TO BAG</p>
                            </button>
                        </div>
                    </div>

                    <div className="productSpecsBox boxes">
                        <h2>{product.subcategory}</h2>
                        <ul>
                            {/*https://www.geeksforgeeks.org/javascript-object-entries-method/*/}
                            {Object.entries(specs).map(([key, value]) => (
                                <li key={key}>
                                    {key}: {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {showOutOfStockModal && (
                    // console.log("out of stock modal"),
                    <div id="outOfStockModal" className="modal active">
                        <div className="modal-content">
                            <span className="close" onClick={this.closeOutOfStockModal}>
                                &times;
                            </span>
                            <h2>Out of Stock</h2>
                            <p>Sorry ! This product is currently out of stock and cannot be added to your cart</p>
                            <button onClick={this.closeOutOfStockModal}>OK</button>
                        </div>
                    </div>
                )}

                {  showQuantityLimitModal && (
                    // console.log("over stock modal"),
                    <div id="quantityLimitModal" className="modal active">
                        <div className="modal-content">
                            {/*<span className="close" onClick={this.closeQuantityLimitModal}>*/}
                            {/*    &times;*/}
                            {/*</span>*/}
                            <h2>Stock Limited</h2>
                            <p>
                                You cannot add more than <strong>{product.stock}</strong> of this product to your cart !
                            </p>
                            <button onClick={this.closeQuantityLimitModal}>OK</button>
                        </div>
                    </div>
                )}

                {(showOutOfStockModal ||   showQuantityLimitModal) && (
                    <div id="modalOverlay" className="active"></div>
                )}

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
