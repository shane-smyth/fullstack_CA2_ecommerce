import React, { Component } from "react"

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cartItems: [],
            showQuantityLimitModal: false,
            productWithLimit: null,
            showRemoveConfirmModal: false,
            productToRemove: null,
        }
    }

    componentDidMount() {
        const cartItemsString = sessionStorage.getItem("cartItems")
        const cartItems = cartItemsString ? this.stringToCart(cartItemsString) : [] 

        const { product, quantity } = this.props.location.state || {}

        if (product) {
            const existingProductIndex = cartItems.findIndex((item) => item.productId === product.productId) 

            if (existingProductIndex === -1) {
                cartItems.push({ ...product, quantity }) 
                console.log("added to cart") 
            }

            sessionStorage.setItem("cartItems", this.cartToString(cartItems))
        }

        this.setState({
            cartItems
        }) 
    }

    cartToString = (cartItems) => {
        return cartItems
            .map((item) =>
                    `${item.productId},${item.name},${item.price},${item.stock},${item.quantity},${item.images[0]},${item.subcategory}`
            ).join(" ") 
    } 

    stringToCart = (cartItemsString) => {
        return cartItemsString.split(" ").map((itemString) => {
            const [productId, name, price, stock, quantity, image, subcategory] = itemString.split(",") 
            return {
                productId,
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                quantity: parseInt(quantity),
                images: [image],
                subcategory,
            } 
        }) 
    }

    handleUpdateQuantity = (productId, newQty) => {
        const { cartItems } = this.state 
        const product = cartItems.find((product) => product.productId === productId) 

        if (newQty > product.stock) {
            this.setState({
                showQuantityLimitModal: true,
                productWithLimit: product,
            }) 
            return 
        }

        this.setState((prevState) => {
            const updatedItems = prevState.cartItems.map((product) =>
                product.productId === productId ? { ...product, quantity: newQty } : product
            ) 

            sessionStorage.setItem("cartItems", this.cartToString(updatedItems))

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
            const updatedItems = prevState.cartItems.filter((product) => product.productId !== productId) 

            sessionStorage.setItem("cartItems", this.cartToString(updatedItems))

            return { cartItems: updatedItems } 
        }) 
    } 

    openRemoveConfirmModal = (productID) => {
        const productToRemove = this.state.cartItems.find((product) => product.productId === productID)
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
            this.handleRemoveItem(productToRemove.productId)
            this.closeRemoveConfirmModal()
        }
    }

    handleCheckout = () => { //
        this.props.history.push("/checkout")
    }

    render() {
        const { cartItems, showQuantityLimitModal, productWithLimit,  showRemoveConfirmModal, productToRemove } = this.state
        const isCartEmpty = cartItems.length === 0

        return (
            <div className="cartPageContainer">
                <h2>Shopping Cart</h2>
                {isCartEmpty ?
                    <p className="emptyCartMessage" >
                        Your shopping cart is empty.
                    </p>:
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
                                <tr key={product.productId}>
                                    <td>
                                            <img
                                                src={product.images[0]}
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
                                                this.handleUpdateQuantity(product.productId, parseInt(e.target.value))
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
                                        <button onClick={() => this.openRemoveConfirmModal(product.productId)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="cartTotalContainer">
                            <p>
                                <strong>Total: </strong>
                                €{cartItems
                                .reduce((sum, product) => sum + product.price * product.quantity, 0)
                                .toFixed(2)}
                            </p>
                        </div>

                        <button
                            type="button"
                            id="checkoutButton"
                            disabled={isCartEmpty}
                            onClick={this.handleCheckout}
                        >
                            CHECKOUT
                        </button>
                    </>
                }

                {showQuantityLimitModal && (
                    <div id="quantityLimitModal" className="modal active">
                        <div className="modal-content">
                            {/*<span className="close" onClick={this.closeQuantityLimitModal}>*/}
                            {/*    &times*/}
                            {/*</span>*/}
                            <h2>Stock Limited</h2>
                            <p>
                                You cannot add more than <strong>{productWithLimit.stock}</strong> of this product to
                                your cart !
                            </p>
                            <button onClick={this.closeQuantityLimitModal}>OK</button>
                        </div>
                    </div>
                )}

                { showRemoveConfirmModal && (
                    <div id="removeConfirmationModal" className="modal active">
                        <div className="modal-content">
                            <h2>Delete Product</h2>
                            <p>
                                Are you sure you want to remove <strong>'{productToRemove?.name}'</strong> from your cart?<br/>
                                <br/>(This cannot not be undone)
                            </p>
                            <button onClick={this.removeProduct}>Yes</button><br/>
                            <button onClick={this.closeRemoveConfirmModal}>Cancel</button>
                        </div>
                    </div>
                )}

                {(showQuantityLimitModal ||  showRemoveConfirmModal) && (
                    <div id="modalOverlay" className="active"></div>
                )}
            </div>
        )
    }
}