import React, { Component } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"


export default class NewProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            description: "",
            price: 0,
            images: [], // to store the image files
            imagePreviews: [], // to store a preview URL of the images
            rating: 0,
            categories: [],
            subcategories: [],
            brands: [],
            selectedCategory: "",
            selectedSubcategory: "",
            brand: "",
            stock: 0,
            specifications: [{key: "", value: ""}],
            newCategory: "",
            newSubcategory: "",
            newBrand: ""
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
        const files = Array.from(e.target.files)
        const previews = files.map(file => URL.createObjectURL(file))
        this.setState((prevState) => ({
            images: [...prevState.images, ...files],
            imagePreviews: [...(prevState.imagePreviews || []), ...previews],
        }))
    }
    removeImage = (index) => {
        this.setState(prevState => ({
            images: prevState.images.filter((_, i) => i !== index),
            imagePreviews: (prevState.imagePreviews || []).filter((_, i) => i !== index),
        }))
    }

    handleCategoryChange = (e) => {
        this.setState({ selectedCategory: e.target.value })

        if (e.target.value !== "new") {
            this.setState({ newCategory: "" })
        }
    }
    handleSubcategoryChange = (e) => {
        this.setState({ selectedSubcategory: e.target.value })

        if (e.target.value !== "new") {
            this.setState({ newSubcategory: "" })
        }
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

        const finalBrand = this.state.brand === "new" ? this.state.brandInput : this.state.brand;
        const finalCategory = this.state.selectedCategory === "new" ? this.state.newCategory : this.state.selectedCategory
        const finalSubcategory = this.state.selectedSubcategory === "new" ? this.state.newSubcategory : this.state.selectedSubcategory
        let formData = new FormData()

        formData.append("name", this.state.name)
        formData.append("description", this.state.description)
        formData.append("price", this.state.price)
        this.state.images.forEach((image) => {
            formData.append("images", image)
        })
        formData.append("rating", this.state.rating)
        formData.append("category", finalCategory)
        formData.append("subcategory", finalSubcategory)
        formData.append("brand", finalBrand)
        formData.append("stock", this.state.stock)

        this.state.specifications.forEach((spec, index) => {
            formData.append(`specifications[${index}][key]`, spec.key)
            formData.append(`specifications[${index}][value]`, spec.value)
        })

        axios.post(`${SERVER_HOST}/products/newProduct`, formData, {
            headers: {
                "authorization": localStorage.token,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                if(res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    } else {
                        console.log("Record added")
                        this.setState({redirectToDisplayAllCars:true})
                    }
                } else {
                    console.log("Record not added")
                }
            })
    }

    render() {
        const { onClose } = this.props
        const { imagePreviews } = this.state

        return (
            <div className="modalOverlay">
                <div className="modalContent">
                    <button className="closeButton" onClick={onClose}>&#x2715;</button> {/* https://stackoverflow.com/questions/5353461/unicode-character-for-x-cancel-close */}

                    <form >
                        <h2>Add New Product</h2>

                        <div className="labelInput">
                            <label>Name:</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Product Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                ref={input => this.inputToFocus = input}
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
                                    {imagePreviews.map((image, index) => (
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
                                placeholder="Raitng"
                                value={this.state.rating}
                                onChange={this.handleChange}
                                min="0"
                                max="5"
                            />
                        </div>

                        <div className="labelInput">
                            <label>Category:</label>
                            <select onChange={this.handleCategoryChange} value={this.state.selectedCategory}>
                                <option value="" disabled hidden>Select Category</option>
                                {this.state.categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                                <option value="new">+ New Category</option>
                            </select>
                            {this.state.selectedCategory === "new" && (
                                <input
                                    type="text"
                                    name="newCategory"
                                    placeholder="Enter New Category"
                                    value={this.state.newCategory}
                                    onChange={(e) => this.setState({ newCategory: e.target.value })}
                                />
                            )}
                        </div>

                        <div className="labelInput">
                            <label>Subcategory:</label>
                            <select onChange={this.handleSubcategoryChange} value={this.state.selectedSubcategory}>
                                <option value="" disabled hidden>Select Subcategory</option>
                                {this.state.subcategories.map((subcategory) => (
                                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                                ))}
                                <option value="new">+ New Subcategory</option>
                            </select>
                            {this.state.selectedSubcategory === "new" && (
                                <input
                                    type="text"
                                    name="newSubcategory"
                                    placeholder="Enter New Subcategory"
                                    value={this.state.newSubcategory}
                                    onChange={(e) => this.setState({ newSubcategory: e.target.value })}
                                />
                            )}
                        </div>


                        <div className="labelInput">
                            <label>Brand:</label>
                            <select onChange={this.handleBrandChange} value={this.state.brand}>
                                <option value="" disabled hidden>Select Brand</option>
                                {this.state.brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                                <option value="new">+ New Brand</option>
                            </select>
                            {this.state.brand === "new" && (
                                <input
                                    type="text"
                                    name="brandInput"
                                    placeholder="Enter New Brand"
                                    value={this.state.brandInput || ""}
                                    onChange={(e) => this.setState({ brandInput: e.target.value })}
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
                            <button type="button" className="greenButton" onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
