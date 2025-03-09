import React, { Component } from "react"
import axios from "axios"
import { Redirect } from "react-router-dom"
import { SANDBOX_CLIENT_ID, SERVER_HOST } from "../config/global_constants"
import PayPalMessage from "./PayPalMessage"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { jwtDecode } from "jwt-decode" // https://www.npmjs.com/package/jwt-decode

export default class BuyProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            redirectToPayPalMessage: false,
            payPalMessageType: null,
            payPalOrderID: null,
        }
    }

    createOrder = (data, actions) => {
        const amount = this.props.price
        console.log("Amount: ", amount)

        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount,
                    },
                },
            ],
        })
    }

    onApprove = (paymentData) => {
        console.log("paymentData:", paymentData)

        const saleInfo = {
            orderID: paymentData.orderID,
            price: this.props.price,
            productId: this.props.productId,
            quantity: this.props.quantity || 1,
            guestInfo: null,
        };

        if (localStorage.token && localStorage.token.trim() !== "") {
            try {
                const decodedToken = jwtDecode(localStorage.token);
                if (decodedToken && decodedToken.userID) {
                    saleInfo.userID = decodedToken.userID;
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        else { // https://developer.paypal.com/sdk/js/reference/#onapprove
            const customer = paymentData.payer
            const shippingAddress = paymentData.purchase_units[0].shipping?.address

            saleInfo.guestInfo = {
                name: customer.name?.given_name && customer.name?.surname ? `${customer.name.given_name} ${customer.name.surname}` : "Guest",
                email: customer.email_address || "no-email@example.com",
                address: shippingAddress
                    ? `${shippingAddress.address_line_1 || ""}, ${shippingAddress.admin_area_2 || ""}, ${shippingAddress.admin_area_1 || ""} ${shippingAddress.postal_code || ""}`
                    : "No address provided",
                phone: customer.phone?.phone_number?.national_number || "No phone provided",
            }
            saleInfo.userID = null
        }

        console.log("Sale Info being sent to backend:", saleInfo)

        // cartitems passed multiple products being bought
        if (this.props.cartItems) {
            saleInfo.cartItems = this.props.cartItems
        }
        else {
            saleInfo.productId = this.props.productId
            saleInfo.quantity = this.props.quantity || 1
        }

        console.log("Sale Info being sent to backend:", saleInfo)

        const path = this.props.cartItems
            ? `${SERVER_HOST}/sales/checkout` // multiple products
            : `${SERVER_HOST}/sales/${paymentData.orderID}/${this.props.productId}/${this.props.price}`  // 1 product

        axios.post(path, saleInfo, {headers: { authorization: localStorage.token, "Content-type": "application/json" }})
            .then((res) => {
                this.setState({
                    payPalMessageType: PayPalMessage.messageType.SUCCESS,
                    payPalOrderID: paymentData.orderID,
                    redirectToPayPalMessage: true,
                })
            })
            .catch((errorData) => {
                console.log("SUCCESSTRANSATIONERROR: ", errorData)
                this.setState({
                    payPalMessageType: PayPalMessage.messageType.ERROR,
                    redirectToPayPalMessage: true,
                })
            })
    }

    onError = (errorData) => {
        this.setState({
            payPalMessageType: PayPalMessage.messageType.ERROR,
            redirectToPayPalMessage: true,
        })
    }

    onCancel = (cancelData) => {
        console.log("PayPal Cancelled:", cancelData)
        this.setState({
            payPalMessageType: PayPalMessage.messageType.CANCEL,
            redirectToPayPalMessage: true,
        })
    }

    render() {
        console.log(this.props)
        return (
            <div>
                {this.state.redirectToPayPalMessage ? (
                    <Redirect
                        to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}
                    />
                ) : null}

                <PayPalScriptProvider
                    options={{ currency: "EUR", "client-id": SANDBOX_CLIENT_ID }}
                >
                    <div className="paypal-button-container">
                        <PayPalButtons
                            style={{ layout: "horizontal" }}
                            createOrder={this.createOrder}
                            onApprove={this.onApprove}
                            onError={this.onError}
                            onCancel={this.onCancel}
                        />
                    </div>
                </PayPalScriptProvider>
            </div>
        )
    }
}