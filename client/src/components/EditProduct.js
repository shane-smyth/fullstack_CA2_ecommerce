import React, {Component} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class EditProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: props.product.name,
            description: props.product.description,
            price: props.product.price,
            images: props.product.images || [],
            rating: props.product.rating,
            categories: [],
            subcategories: [],
            brands: [],
            selectedCategory: props.product.category,
            selectedSubcategory: props.product.subcategory,
            brand: props.product.brand,
            stock: props.product.stock,
            specifications: props.product.specifications || [{key: "", value: ""}],
        }
    }

    componentDidMount() {
        this.inputToFocus.focus()

        axios.get(`${SERVER_HOST}/products`)
            .then(res => {
                if (res.data) {
                    const products = res.data
                    const brands = [...new Set(products.flatMap(product => product.brand))]
                    const categories = [...new Set(products.flatMap(product => product.category))]
                    const subcategories = [...new Set(products.flatMap(product => product.subcategory))]

                    this.setState({categories, subcategories, brands})
                } else {
                    console.log("Records not found.")
                }
            })
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }


    handleImageChange = (e) => {
        const urls = Array.from(e.target.files).map(file => window.URL.createObjectURL(file))
        this.setState(prevState => ({images: [...prevState.images, ...urls]}))
    }
    removeImage = (index) => {
        this.setState(prevState => ({
            images: prevState.images.filter((_, i) => i !== index)
        }))
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
        const {name, value} = e.target
        const specifications = [...this.state.specifications]
        specifications[index][name] = value
        this.setState({specifications})
    }
    addSpecification = () => {
        this.setState(prevState => ({
            specifications: [...prevState.specifications, {key: "", value: ""}],
        }))
    }
    removeSpecification = (index) => {
        this.setState(prevState => ({
            specifications: prevState.specifications.filter((_, i) => i !== index),
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const updatedProduct = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            images: this.state.images,
            rating: this.state.rating,
            category: this.state.selectedCategory,
            subcategory: this.state.selectedSubcategory,
            brand: this.state.brand,
            stock: this.state.stock,
            specifications: this.state.specifications,
        }
        console.log("Updated Product:", updatedProduct); // Log the payload
        axios.put(`${SERVER_HOST}/products/edit/${this.props.product._id}`, updatedProduct)
            .then(res => {
                if (res.data) {
                    console.log("Product updated successfully")
                    this.props.onClose()
                } else {
                    console.log("Updating product failed")
                }
            })
    }

    render() {
        const {onClose} = this.props
        return (
            <div className="modalOverlay">
                <div className="modalContent">
                    <button className="closeButton" onClick={onClose}>&#x2715;</button>
                    <h2>Edit Product</h2>

                    <form onSubmit={this.handleSubmit}>
                        <div className="labelInput">
                            <label>Name:</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Product Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                ref={input => (this.inputToFocus = input)}
                            />
                        </div>

                        <div className="labelInput">
                            <label>Description:</label>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={this.state.description}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="labelInput">
                            <label>Price:</label>
                            <input
                                name="price"
                                type="number"
                                placeholder="Price"
                                value={this.state.price}
                                onChange={this.handleChange}
                                min="0"
                            />
                        </div>

                        <div className="labelInput">
                            <div className="imageInputContainer">
                                <div className="imagePreview">
                                    {this.state.images.map((image, index) => (
                                        <div key={index} className="imageContainer">
                                            <button className="removeImageButton" onClick={() => this.removeImage(index)}>&#x2715;</button>
                                            <img src={image} alt="Product" className="previewImage"/>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={this.handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="labelInput">
                            <label>Rating:</label>
                            <input
                                name="rating"
                                type="number"
                                placeholder="Rating"
                                value={this.state.rating}
                                onChange={this.handleChange}
                                min="0"
                                max="5"
                            />
                        </div>

                        <div className="labelInput">
                            <label>Category:</label>
                            <select onChange={this.handleCategoryChange} value={this.state.selectedCategory}>
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
                        </div>

                        <div className="labelInput">
                            <label>Subcategory:</label>
                            <select onChange={this.handleSubcategoryChange} value={this.state.selectedSubcategory}>
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
                        </div>

                        <div className="labelInput">
                            <label>Brand:</label>
                            <select onChange={this.handleBrandChange} value={this.state.brand}>
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
                        </div>

                        <div className="labelInput">
                            <label>Stock:</label>
                            <input
                                name="stock"
                                type="number"
                                placeholder="Stock"
                                value={this.state.stock}
                                onChange={this.handleChange}
                                min="0"
                            />
                        </div>

                        <h3>Specifications</h3>
                        {this.state.specifications.map((spec, index) => (
                            <div key={index} className="specificationGroup">
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

                        <div className="formAction">
                            <button className="greenButton" type="submit">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
