// import React, {Component} from "react"
// import Logout from "./Logout"
// // import axios from "axios"
// // import {SERVER_HOST} from "../config/global_constants"
//
// export default class Account extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             user: null,
//         }
//     }
//
//     render() {
//         return (
//             <div className="accountPage boxes">
//                 <div className="accountContainer">
//                     <div className="accountPageHeader boxes">
//                         <Logout />
//                         <h1>Account</h1>
//                     </div>
//                     <div className="accountPageBody boxes">
//                         <h2>name</h2>
//                     </div>
//                     <div className="accountHistory boxes">
//                         <h2>Account History</h2>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

import React, { Component } from "react"
import Logout from "./Logout"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

export default class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            purchaseHistory: [],
            showReturnConfirmModal: false,
            productToReturn: null,
        }
    }

    componentDidMount() {

        const user = JSON.parse(localStorage.getItem("user"))
        console.log("User from localStorage:", user)

        if (user) {
            this.setState({
                user: user
            })

            const token = localStorage.getItem("token")
            // console.log("Token from localStorage:", token)

            axios.get(`${SERVER_HOST}/sales`, { headers: { Authorization: token }})
                .then((res) => {
                    console.log("purchase history res:", res.data)
                    if (res.data && res.data.length > 0) {
                        this.setState({
                            purchaseHistory: res.data
                        })
                    }
                })
                .catch((error) => {
                    console.error("Error fetching purchase history:", error)
                })
        }
        else {
            console.error("No user found in localStorage")
        }
    }

    openReturnConfirmModal = (purchase) => {
        this.setState({
            showReturnConfirmModal: true,
            productToReturn: purchase,
        })
    }

    closeReturnConfirmModal = () => {
        this.setState({
            showReturnConfirmModal: false,
            productToReturn: null,
        })
    }

    handleReturnProduct = () => {
        const { productToReturn } = this.state

        if (productToReturn) {
            console.log("Product to return:", productToReturn)
            console.log("Product ID:", productToReturn.productID)
            console.log("Quantity:", productToReturn.quantity)

            axios.post(`${SERVER_HOST}/returnStock`, {
                productID: productToReturn.productID,
                quantity: productToReturn.quantity,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            })
                .then((res) => {
                    if (res.data.success) {
                        console.log("Stock restored successfully")

                        // make sure its returned in db too
                        axios.put(`${SERVER_HOST}/sales/${productToReturn._id}/return`, {}, {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                            },
                        })
                            .then((res) => {
                                if (res.data.success) {
                                    console.log("sale returned changed")

                                    this.setState((prevState) => ({
                                        purchaseHistory: prevState.purchaseHistory.map((purchase) =>
                                            purchase._id === productToReturn._id
                                                ? { ...purchase, returned: true }
                                                : purchase
                                        ),
                                        showReturnConfirmModal: false,
                                        productToReturn: null,
                                    }))
                                }
                                else {
                                    console.error("Failed to change sale as returned:", res.data.errorMessage)
                                }
                            })
                    }
                    else {
                        console.error("Failed to return stock:", res.data.errorMessage)
                    }
                })
                .catch((error) => {
                    console.error("Error returning stock:", error)
                })
        }
    }

    render() {
        const { user, purchaseHistory, showReturnConfirmModal, productToReturn } = this.state

        return (
            <div className="accountPage boxes">
                <div className="accountContainer">
                    <div className="accountPageHeader boxes">
                        <Logout />
                        <h1>Account</h1>
                    </div>
                    <div className="accountPageBody boxes">
                        <h2>{user ? user.name : ""}</h2>
                    </div>
                    <div className="accountHistory boxes">
                        <h2>Account History</h2>
                        {purchaseHistory && purchaseHistory.length > 0 ? (
                            <ul>
                                {purchaseHistory.map((purchase, index) => (
                                    <li key={index}>
                                        <div className={purchase.returned ? "returnedPurchase" : ""}>
                                            <p>Payment ID: {purchase.paypalPaymentID}</p>
                                            <p>Product ID: {purchase.productID}</p>
                                            <p>Price: ${purchase.price}</p>
                                            <p>Quantity: {purchase.quantity}</p>
                                        </div>
                                        {purchase.returned ? (
                                            <p className="returnedLabel">This product was returned</p>
                                        ) : (
                                            <button onClick={() => this.openReturnConfirmModal(purchase)}>Return Product</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="emptyMessage">No purchase history available.</p>
                        )}
                    </div>
                </div>

                {showReturnConfirmModal && (
                    <div id="returnConfirmationModal" className="modal active">
                        <div className="modal-content">
                            <h2>Return Product</h2>
                            <p>
                                Are you sure you want to return <strong>'{productToReturn?.productID}'</strong>?<br />
                                <br />(This cannot be undone)
                            </p>
                            <button onClick={this.handleReturnProduct}>Yes</button><br />
                            <button onClick={this.closeReturnConfirmModal}>Cancel</button>
                        </div>
                    </div>
                )}

                {showReturnConfirmModal && (
                    <div id="modalOverlay" className="active"></div>
                )}
            </div>
        )
    }
}