import React, { Component } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

export default class AdminShowSales extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sales: []
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/sales`, { headers: { "authorization": localStorage.token } })
            .then(response => {
                // console.log("all sales:", response.data)
                this.setState({
                    sales: response.data
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                <h1>Customer Purchase History</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product ID</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>User</th>
                        <th>Guest Info</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.sales.map((sale) => (
                        <tr key={sale._id}>
                            <td className={sale.returned ? "strikethrough" : ""}>{sale.paypalPaymentID}</td>
                            <td className={sale.returned ? "strikethrough" : ""}>{sale.productID}</td>
                            <td className={sale.returned ? "strikethrough" : ""}>{sale.price}</td>
                            <td className={sale.returned ? "strikethrough" : ""}>{sale.quantity}</td>
                            <td className={sale.returned ? "strikethrough" : ""}>{sale.userID ? sale.userID.username : "Guest"}</td>
                            <td className={sale.returned ? "strikethrough" : ""}>
                                {sale.guestInfo ? (
                                    <div>
                                        <p>Name: {sale.guestInfo.name}</p>
                                        <p>Address: {sale.guestInfo.address}</p>
                                        <p>Phone: {sale.guestInfo.phone}</p>
                                        <p>Email: {sale.guestInfo.email}</p>
                                    </div>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td>
                                {sale.returned ? (
                                    <span className={"returned"}>Returned</span>
                                ) : (
                                    <span>Active</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}