import React, {Component} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
import NewProduct from "./NewProduct";
import EditProduct from "./EditProduct";

export default class AdminShowProducts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            selectedProducts: [],
            searchQuery: "",
            sortBy: "None Selected",
            addProduct: false,
            editProduct: false,
            selectedProduct: null,
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products`)
            .then(res => {
                if (res.data) {
                    this.setState({
                        products: res.data,
                        selectedProducts: res.data,
                    })
                }
                else {
                    console.log("Records not found")
                }
            })
    }


    confirmDelete = (productId) => {
        if (window.confirm("Are you sure?")) {
            this.handleDelete(productId)
        }
    }
    handleDelete = (id) => {
        axios.delete(`${SERVER_HOST}/products/delete/${id}`)
            .then(res => {
                if (res.data) {
                    if (res.data.error) {
                        console.log(res.data.error)
                    }
                    else {
                        console.log("record deleted")
                        // refreshes the state so when the admin deletes a product, the component refreshes with the deleted product gone
                        this.setState(prevState => {
                            const updatedProducts = prevState.products.filter(product => product._id !== id)
                            return { products: updatedProducts, selectedProducts: updatedProducts }
                        })
                    }
                }
                else {
                    console.log("record not deleted")
                }
            })
    }


    handleSearchChange = (e) => {
        this.setState({
            searchQuery: e.target.value
        }, this.updateFilteredProducts)
    }
    handleSortChange = (e) => {
        this.setState({
            sortBy: e.target.value
        }, this.updateFilteredProducts)
    }
    updateFilteredProducts = () => {
        let { products, searchQuery, sortBy } = this.state

        let filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (sortBy === "A-Z") {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortBy === "Z-A") {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        } else if (sortBy === "High to Low") {
            filteredProducts.sort((a, b) => b.price - a.price)
        } else if (sortBy === "Low to High") {
            filteredProducts.sort((a, b) => a.price - b.price)
        }

        this.setState({ selectedProducts: filteredProducts })
    }

    openAddModal = () => {
        this.setState({addProduct: true})
    }
    closeAddModal = () => {
        this.setState({ addProduct: false })
    }

    openEditModal = (product) => {
        this.setState({
            editProduct: true,
            selectedProduct: product,
        })
    }
    closeEditModal = () => {
        this.setState({ editProduct: false })
    }


    render() {
        const { selectedProducts, addProduct, editProduct } = this.state

        return (
            <div className="adminProdCardBox">
                <button onClick={this.openAddModal}>Add Product</button>

                <input
                    type="text"
                    className="input"
                    placeholder="Search"
                    onChange={this.handleSearchChange}
                />

                <select onChange={this.handleSortChange}>
                    <option>None Selected</option>
                    <option>A-Z</option>
                    <option>Z-A</option>
                    <option>High to Low</option>
                    <option>Low to High</option>
                </select>

                <br/>
                <br/>
                {selectedProducts.map((product, index) => (
                    <div className="cardBody" key={index} onClick={() => this.openEditModal(product)}>
                        <div className="adminProdCardImg">
                            <img src={product.images[0]} alt={product.name} />
                        </div>

                        <div className="adminProdDetails">
                            <h4>{product.name}</h4>
                            <h3>€{product.price}</h3>
                            <p>Stock Level: {product.stock}</p>
                        </div>

                        <div className="userEdits">
                            {/*<button className="greenButton">Edit</button>*/}
                            <button onClick={() => this.confirmDelete(product._id)} className="redButton">Delete</button>
                        </div>
                    </div>
                ))}

                {addProduct && <NewProduct onClose={this.closeAddModal} />}
                {editProduct && <EditProduct onClose={this.closeEditModal} product={this.state.selectedProduct}/>}
            </div>
        )
    }
}
