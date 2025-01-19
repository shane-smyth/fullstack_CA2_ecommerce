import React, { Component } from "react";
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

export default class Test extends Component {

    constructor(props) {
        super(props)

        this.state = {
            products: [],
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products`)
            .then(res => {
                if (res.data) {
                    this.setState({ products: res.data })
                }
                else {
                    console.log("Records not found.")
                }
            })
    }

    render() {
        let products = this.state.products
        return (
            <div className="form-container">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Images</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map(product => (
                                <tr key={product.productId}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.images.map(image => (
                                        <img src={image} className="imgProductList" />
                                    ))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
