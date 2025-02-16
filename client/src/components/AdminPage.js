import React, { Component } from "react"
import NewProduct from "./NewProduct"
import DisplayUsers from "./DispalyUsers"
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
                    <button onClick={() => this.handleComponentChange("AddProduct")}><h2>Add Product</h2></button>
                    <button onClick={() => this.handleComponentChange("ProductManagement")}><h2>Mange Products</h2></button>
                    <button onClick={() => this.handleComponentChange("UserManagement")}><h2>Mange Users</h2></button>
                </div>
                <div className="wholeAdminContent boxes">
                    {activeComponent === null && <NewProduct />}
                    {activeComponent === "AddProduct" && <NewProduct />}
                    {activeComponent === "ProductManagement" && <h3>Product Management</h3>}
                    {activeComponent === "UserManagement" && <DisplayUsers />}
                </div>
            </div>
        )
    }
}
