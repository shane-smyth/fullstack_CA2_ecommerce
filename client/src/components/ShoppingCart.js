import React, { Component } from "react"
import { SERVER_HOST } from "../config/global_constants"
import BuyProduct from "./BuyProduct"
import axios from "axios"

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cartItems: [],
            productImages: {},
            showQuantityLimitModal: false,
            productWithLimit: null,
            showRemoveConfirmModal: false,
            productToRemove: null,
        }
    }

    componentDidMount() {
        const storedCart = localStorage.getItem("cartItems")
        const cartItems = storedCart ? JSON.parse(storedCart) : []

        const { product, quantity = 1 } = this.props.location.state || {}

        if (product) {
            console.log("current cart:", cartItems)

            const existingProductIndex = cartItems.findIndex((item) => item._id === product._id)

            if (existingProductIndex === -1) {
                cartItems.push({ ...product, quantity })
            }
            else {
                console.log("products exisits in cart updating quantity:", product)
                cartItems[existingProductIndex].quantity += quantity
            }

            localStorage.setItem("cartItems", JSON.stringify(cartItems))

            this.setState({ cartItems }, this.fetchProductImages)
        }
        else {
            this.setState({ cartItems }, this.fetchProductImages)
        }
    }


    fetchProductImages = () => {
        const { cartItems } = this.state
        cartItems.forEach(product => {
            if (product.images && product.images.length > 0) {
                const image = product.images[0]
                axios.get(`${SERVER_HOST}/products/photo/${image.filename}`)
                    .then(res => {
                        if (res.data && !res.data.errorMessage) {
                            this.setState(prevState => ({
                                productImages: {
                                    ...prevState.productImages,
                                    [product._id]: `data:;base64,${res.data.image}`
                                }
                            }))
                        }
                    })
                    .catch(err => {
                        console.error("Error fetching image:", err)
                    })
            }
        })
    }

    updateCartStorage = (cartItems) => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }

    handleUpdateQuantity = (productId, newQty) => {
        const { cartItems } = this.state
        const product = cartItems.find((product) => product._id === productId)

        if (newQty > product.stock) {
            this.setState({
                showQuantityLimitModal: true,
                productWithLimit: product,
            })
            return
        }

        this.setState((prevState) => {
            const updatedItems = prevState.cartItems.map(product =>
                product._id === productId ? { ...product, quantity: newQty } : product
            )
            this.updateCartStorage(updatedItems)
            return { cartItems: updatedItems }
        })
    }

    closeQuantityLimitModal = () => {
        this.setState({
            showQuantityLimitModal: false,
            productWithLimit: null,
        })
    }

    handleRemoveItem = (productId) => {
        this.setState((prevState) => {
            const updatedItems = prevState.cartItems.filter((product) => product._id !== productId)
            this.updateCartStorage(updatedItems)
            return { cartItems: updatedItems }
        })
    }

    openRemoveConfirmModal = (productID) => {
        const productToRemove = this.state.cartItems.find((product) => product._id === productID)
        this.setState({
            showRemoveConfirmModal: true,
            productToRemove,
        })
    }

    closeRemoveConfirmModal = () => {
        this.setState({
            showRemoveConfirmModal: false,
            productToRemove: null,
        })
    }

    removeProduct = () => {
        const { productToRemove } = this.state
        if (productToRemove) {
            this.handleRemoveItem(productToRemove._id)
            this.closeRemoveConfirmModal()
        }
    }

    handleCheckout = () => {
        this.props.history.push("/checkout")
    }

    render() {
        const { cartItems, productImages, showQuantityLimitModal, productWithLimit, showRemoveConfirmModal, productToRemove } = this.state
        const isCartEmpty = cartItems.length === 0
        const totalPrice = cartItems.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2)

        return (
            <div className="cartPageContainer">
                <h2>Shopping Cart</h2>
                {isCartEmpty ?
                    <p className="emptyMessage">Your shopping cart is empty.</p>
                    :
                    <>
                        <table className="cartTable">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={productImages[product._id] || product.images[0]}
                                            alt={product.name}
                                            className="productCartImage"
                                        />
                                        <div>
                                            <div>{product.name}</div>
                                        </div>
                                    </td>
                                    <td>€{product.price.toFixed(2)}</td>
                                    <td>
                                        <select
                                            value={product.quantity}
                                            onChange={(e) =>
                                                this.handleUpdateQuantity(product._id, parseInt(e.target.value))
                                            }
                                        >
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
                                    </td>
                                    <td>€{(product.price * product.quantity).toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => this.openRemoveConfirmModal(product._id)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="cartTotalContainer">
                            <p><strong>Total: </strong>€{totalPrice}</p>
                        </div>

                        <BuyProduct price={totalPrice} cartItems={cartItems}/>
                    </>
                }

                {showQuantityLimitModal && (
                    <div id="quantityLimitModal" className="modal active">
                        <div className="modal-content">
                            <h2>Stock Limited</h2>
                            <p>
                                You cannot add more than <strong>{productWithLimit.stock}</strong> of this product to
                                your cart!
                            </p>
                            <button onClick={this.closeQuantityLimitModal}>OK</button>
                        </div>
                    </div>
                )}

                {showRemoveConfirmModal && (
                    <div id="removeConfirmationModal" className="modal active">
                        <div className="modal-content">
                            <h2>Delete Product</h2>
                            <p>
                                Are you sure you want to remove <strong>'{productToRemove?.name}'</strong> from your cart?<br/>
                                <br/>(This cannot be undone)
                            </p>
                            <button onClick={this.removeProduct}>Yes</button><br/>
                            <button onClick={this.closeRemoveConfirmModal}>Cancel</button>
                        </div>
                    </div>
                )}

                {(showQuantityLimitModal || showRemoveConfirmModal) && (
                    <div id="modalOverlay" className="active"></div>
                )}
            </div>
        )
    }
}