import React, {Component, createRef} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
import Toast from "./Toast"

export default class EditProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            product: props.product || [],
            name: props.product.name,
            description: props.product.description,
            price: props.product.price,
            images: props.product.images,
            productImages: [],
            imagesPreviews: [],
            removedImages: [],
            rating: props.product.rating,
            selectedCategory: props.product.category,
            selectedSubcategory: props.product.subcategory,
            brand: props.product.brand,
            stock: props.product.stock,
            specifications: props.product.specifications || [{key: "", value: ""}],
            categories: [],
            subcategories: [],
            brands: [],
        }

        this.toastRef = createRef() //https://legacy.reactjs.org/docs/refs-and-the-dom.html
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

                    this.setState({
                        categories: categories,
                        subcategories: subcategories,
                        brands: brands,
                    }, () => this.fetchProductImages())
                } else {
                    console.log("Records not found.")
                }
            })
            .catch(err => {
                this.toastRef.current.showError(
                    err.response.data.errorMessage || "Error fetching products",
                )
            })
    }

    fetchProductImages = () => {
        const images = this.state.images
        if (images.length > 0) {
            images.forEach(image => {
                axios.get(`${SERVER_HOST}/products/photo/${image.filename}`)
                    .then(res => {
                        if (res.data) {
                            if (res.data.errorMessage) {
                                console.log(res.data.errorMessage)
                            } else {
                                this.setState(prevState => ({
                                    productImages: [...prevState.productImages, `data:;base64,${res.data.image}`]
                                }))
                            }
                        } else {
                            console.log("Image not found")
                        }
                    })
                    .catch(err => {
                        this.toastRef.current.showError(
                            err.response.data.errorMessage || "Error fetching image",
                        )
                    })
            })
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }


    handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const previews = files.map(file => URL.createObjectURL(file))
        this.setState((prevState) => ({
            productImages: [...prevState.productImages, ...files],
            imagePreviews: [...(prevState.imagePreviews || []), ...previews],
        }))
    }
    removeImage = (index) => {
        this.setState((prevState) => {
            const updatedProductImages = [...prevState.productImages]
            const removedImage = updatedProductImages[index]

            let updatedRemovedImages = [...prevState.removedImages]
            if (typeof removedImage === "string") {
                updatedRemovedImages.push(prevState.images[index].filename)
            }

            updatedProductImages.splice(index, 1)

            return {
                productImages: updatedProductImages,
                removedImages: updatedRemovedImages,
            }
        })
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
        e.preventDefault();

        let formData = new FormData()
        formData.append("name", this.state.name)
        formData.append("description", this.state.description)
        formData.append("price", this.state.price)

        this.state.productImages.forEach((image) => {
            if (image instanceof File) {
                formData.append("images", image)
            }
        })

        formData.append("rating", this.state.rating)
        formData.append("category", this.state.selectedCategory)
        formData.append("subcategory", this.state.selectedSubcategory)
        formData.append("brand", this.state.brand)
        formData.append("stock", this.state.stock)

        this.state.specifications.forEach((spec, index) => {
            formData.append(`specifications[${index}][key]`, spec.key)
            formData.append(`specifications[${index}][value]`, spec.value)
        })

        // send removed images as a JSON string
        formData.append("removedImages", JSON.stringify(this.state.removedImages))

        axios.put(`${SERVER_HOST}/products/edit/${this.props.product._id}`, formData, {
            headers: {
                "authorization": localStorage.token,
                "Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            if (res.data) {
                console.log("Product updated successfully")
                this.props.onClose();
            } else {
                console.log("Updating product failed")
            }
        })
        .catch(err => {
            this.toastRef.current.showError(
                err.response.data.errorMessage || "Error updating product",
            )
        })

        this.props.onClose()
    }


    render() {
        const { onClose } = this.props
        const { productImages } = this.state

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
                                    {Array.isArray(productImages) && productImages.map((image, index) => (
                                        <div key={index} className="imageContainer">
                                            <button
                                                className="removeImageButton"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents triggering parent handlers
                                                    this.removeImage(index);
                                                }}>
                                                &#x2715;</button>
                                            <img
                                                src={typeof image === "string" ? image : URL.createObjectURL(image)}
                                                alt="Product"
                                                className="previewImage"/>
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
                <Toast ref={this.toastRef} />
            </div>
        )
    }
}