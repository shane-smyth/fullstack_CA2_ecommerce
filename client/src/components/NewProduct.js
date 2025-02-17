import React, { Component } from "react"
import axios from "axios"
import { Link, Redirect } from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants"


export default class NewProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            description: "",
            price: 0,
            images: [],
            rating: 0,
            categories: [],
            subcategories: [],
            brands: [],
            selectedCategory: [],
            selectedSubcategory: [],
            brand: "",
            stock: 0,
            specifications: [{key: "", value: ""}],
        }
    }

    componentDidMount() {
        this.inputToFocus.focus()

        axios.get(`${SERVER_HOST}/products`)
            .then(res => {
                if (res.data) {
                    // console.log("Received data:", res.data)

                    const products = res.data
                    const brands = [...new Set(products.flatMap((product) => product.brand))]
                    const categories = [...new Set(products.flatMap((product) => product.category))]
                    const subcategories = [...new Set(products.flatMap((product) => product.subcategory))]

                    this.setState({
                        categories: categories,
                        subcategories: subcategories,
                        brands: brands,
                    })
                }
                else {
                    console.log("Records not found.")
                }
            })
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleImageChange = (e) => {
        //https://www.js-craft.io/blog/using-url-createobjecturl-to-create-uploaded-image-previews-in-javascript/#:~:text=createObjectURL()%20method.,the%20URL%20is%20explicitly%20released.
        const url = window.URL.createObjectURL(e.target.files[0])
        let photos = this.state.images
        photos.push(url)
        this.setState({ images: photos })
        console.log(this.state.images)
    }

    handleCategoryChange = (e) => {
        this.setState({ selectedCategory: e.target.value })
        console.log(this.state.selectedCategory)
    }

    handleSubcategoryChange = (e) => {
        this.setState({ selectedSubcategory: e.target.value })
    }

    handleBrandChange = (e) => {
        this.setState({ brand: e.target.value })
    }

    handleSpecificationChange = (index, e) => {
        const { name, value } = e.target
        const specifications = [...this.state.specifications]
        specifications[index][name] = value
        this.setState({ specifications })
    }

    addSpecification = () => {
        this.setState((prevState) => ({
            specifications: [...prevState.specifications, {key: "", value: ""}],
        }))
    }

    removeSpecification = (index) => {
        this.setState((prevState) => ({
            specifications: prevState.specifications.filter((_, i) => i !== index),
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const productObj = {
            name : this.state.name,
            description : this.state.description,
            price : this.state.price,
            images : this.state.images,
            rating: this.state.rating,
            category: this.state.selectedCategory,
            subcategory: this.state.selectedSubcategory,
            brand : this.state.brand,
            stock : this.state.stock,
            specifications : this.state.specifications,
        }

        axios.post(`${SERVER_HOST}/products/newProduct`, productObj)
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    }
                    else {
                        console.log(`Product Added`)
                    }
                }
                else {
                    console.log(`Adding Product Failed`)
                }
            })
    }

    render() {
        const { onClose } = this.props

        return (
            <div className="modalOverlay">
                <div className="modalContent">
                    <button className="closeButton" onClick={onClose}>✖</button>

                    <br/>
                    <br/>
                    <form >
                        <h2>Add New Product</h2>

                        <input
                            name="name"
                            type="text"
                            placeholder="Product Name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            ref={input => this.inputToFocus = input}
                        />

                        <input
                            name="description"
                            type="text"
                            placeholder="Description"
                            value={this.state.description}
                            onChange={this.handleChange}
                        />

                        <input
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={this.state.price}
                            onChange={this.handleChange}
                            min="0"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            capture="camera"
                            multiple
                            onChange={this.handleImageChange}
                        />

                        <input
                            name="rating"
                            type="number"
                            placeholder="Raitng"
                            value={this.state.rating}
                            onChange={this.handleChange}
                            min="0"
                            max="5"
                        />

                        <select onChange={this.handleCategoryChange}>
                            <option value="none" disabled selected hidden>Select Category</option>
                            {this.state.categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                            <option value="new">+ New Category</option>
                        </select>
                        {this.state.selectedCategory === "new" && (
                            <input
                                type="text"
                                placeholder="Enter New Category"
                                onChange={this.handleChange}
                            />
                        )}

                        <select onChange={this.handleSubcategoryChange}>
                            <option value="none" disabled selected hidden>Select Subcategory</option>
                            {this.state.subcategories.map((subcategory) => (
                                <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))}
                            <option value="new">+ New Subcategory</option>
                        </select>
                        {this.state.selectedSubcategory === "new" && (
                            <input
                                type="text"
                                placeholder="Enter New Subcategory"
                                onChange={this.handleChange}
                            />
                        )}

                        <select onChange={this.handleBrandChange}>
                            <option value="none" disabled selected hidden>Select Brand</option>
                            {this.state.brands.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                            <option value="new">+ New Brand</option>
                        </select>
                        {this.state.brand === "new" && (
                            <input
                                type="text"
                                placeholder="Enter New Brand"
                                onChange={this.handleChange}
                            />
                        )}

                        <input
                            name="stock"
                            type="number"
                            placeholder="Stock"
                            value={this.state.stock}
                            onChange={this.handleChange}
                            min="0"
                        />

                        <h3>specs</h3>
                        {this.state.specifications.map((spec, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    name="key"
                                    placeholder="Key"
                                    value={spec.key}
                                    onChange={(event) => this.handleSpecificationChange(index, event)}
                                />
                                <input
                                    type="text"
                                    name="value"
                                    placeholder="Value"
                                    value={spec.value}
                                    onChange={(event) => this.handleSpecificationChange(index, event)}
                                />
                                <button type="button" onClick={() => this.removeSpecification(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={this.addSpecification}>Add</button>

                        <button type="button" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}
