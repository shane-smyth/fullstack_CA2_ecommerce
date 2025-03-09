import React, { Component } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

export default class AdminShowSales extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sales: [],
            searchQuery: "",
            sortBy: "None Selected",
            filteredSales: [],
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/sales`, { headers: { "authorization": localStorage.token } })
            .then(response => {
                // console.log("all sales:", response.data)
                this.setState({
                    sales: response.data,
                    filteredSales: response.data,
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleSearchChange = (e) => {
        this.setState({
            searchQuery: e.target.value
        }, this.updateFilteredSales)
    }

    handleSortChange = (e) => {
        this.setState({
            sortBy: e.target.value
        }, this.updateFilteredSales)
    }

    updateFilteredSales = () => {
        const { sales, searchQuery, sortBy } = this.state

        let filteredSales = sales.filter(sale =>
            sale.paypalPaymentID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.productID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sale.userID && sale.userID.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (sale.guestInfo && (
                sale.guestInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sale.guestInfo.email.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        )

        if (sortBy === "A-Z") {
            filteredSales.sort((a, b) => a.productID.localeCompare(b.productID))
        }
        else if (sortBy === "Z-A") {
            filteredSales.sort((a, b) => b.productID.localeCompare(a.productID))
        }
        else if (sortBy === "High to Low") {
            filteredSales.sort((a, b) => b.price - a.price)
        }
        else if (sortBy === "Low to High") {
            filteredSales.sort((a, b) => a.price - b.price)
        }

        this.setState({ filteredSales })
    }

    render() {
        const { filteredSales, searchQuery, sortBy } = this.state

        return (
            <div className="adminShowSales">
                <h1>Customer Purchase History</h1>

                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                />

                <select value={sortBy} onChange={this.handleSortChange}>
                    <option>None Selected</option>
                    <option>A-Z</option>
                    <option>Z-A</option>
                    <option>High to Low</option>
                    <option>Low to High</option>
                </select>

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
                    {filteredSales.map((sale) => (
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