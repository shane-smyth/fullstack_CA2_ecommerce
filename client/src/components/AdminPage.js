import React, { Component } from "react"
import NewProduct from "./NewProduct"
import DisplayUsers from "./DispalyUsers"
import AdminShowProducts from "./AdminShowProducts"
// import { Link } from "react-router-dom"

export default class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeComponent: null,
        }
    }

    handleComponentChange = (component) => {
        this.setState({ activeComponent: component })
    }


    render() {
        const { activeComponent } = this.state

        return (
            <div>
                <div className="wholeAdminContent adminButtons boxes">
                    <button onClick={() => this.handleComponentChange("ProductManagement")}><h2>Products</h2></button>
                    <button onClick={() => this.handleComponentChange("UserManagement")}><h2>Users</h2></button>
                    <button onClick={() => this.handleComponentChange("Orders")}><h2>Orders</h2></button>
                </div>
                <div className="wholeAdminContent boxes">
                    {activeComponent === null && <AdminShowProducts />}
                    {activeComponent === "ProductManagement" && <div className="adminProdContainer"><AdminShowProducts /></div>}
                    {activeComponent === "UserManagement" && <DisplayUsers />}
                    {activeComponent === "Orders" && <h2>History</h2>}
                </div>
            </div>
        )
    }
}
