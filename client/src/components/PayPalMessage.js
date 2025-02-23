import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom" 

export default class PayPalMessage extends Component {
    static messageType = {
        SUCCESS: "success",
        ERROR: "error",
        CANCEL: "cancel"
    } 

    constructor(props) {
        super(props) 

        this.state = {
            redirectToHome: false,
            buttonColour: "red-button",
            heading: "",
            message: ""
        } 
    }

    componentDidMount() {
        const {messageType} = this.props.match.params 

        if (messageType === PayPalMessage.messageType.SUCCESS) {
            this.setState({
                heading: "PayPal Transaction Confirmation",
                message: "Your PayPal transaction was successful.",
                buttonColour: "green-button"
            }) 
        }
        else if (messageType === PayPalMessage.messageType.CANCEL) {
            this.setState({
                heading: "PayPal Transaction Cancelled",
                message: "You cancelled your PayPal transaction. Therefore, the transaction was not completed."
            }) 
        }
        else if (messageType === PayPalMessage.messageType.ERROR) {
            this.setState({
                heading: "PayPal Transaction Error",
                message: "An error occurred when trying to perform your PayPal transaction. The transaction was not completed. Please try to perform your transaction again."
            }) 
        }
        else {
            console.log("The 'messageType' prop that was passed into the PayPalMessage component is invalid. It must be one of the following: PayPalMessage.messageType.SUCCESS, PayPalMessage.messageType.CANCEL or PayPalMessage.messageType.ERROR") 
        }
    }

    render() {
        const {heading, message, buttonColour, redirectToHome} = this.state 
        const {messageType, payPalPaymentID} = this.props.match.params 

        if (redirectToHome) {
            return <Redirect to="/home"/> 
        }

        return (
            <div className="payPalMessage">
                <h3>{heading}</h3>
                <p>{this.props.match.params.message}</p>
                <p>{message}</p>

                {messageType === PayPalMessage.messageType.SUCCESS && (
                    <p>Your PayPal payment confirmation is <span id="payPalPaymentID">{payPalPaymentID}</span></p>
                )}

                <p id="payPalPaymentIDButton">
                    <Link className={buttonColour} to="/home">Back to Home</Link>
                </p>
            </div>
        ) 
    }
}