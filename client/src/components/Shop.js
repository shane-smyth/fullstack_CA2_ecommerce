import React, { Component } from "react"
// import { Link } from "react-router-dom"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
// import DisplayAllProducts from "./DisplayAllProducts"
import ProductCard from "./ProductCard";

export default class Shop extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            filteredProducts: [],
            brands: [],
            selectedBrand: [],
            minPrice: 0,
            maxPrice: 0,
            priceRange: [0, 0],
            inStock: false,
            selectedRating: [],
            allBrands: false,
            categories: [],
            selectedCategory: [],
            allCategories: false,
            sortOption: "None Selected",
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products`)
            .then((res) => {
                if (res.data) {
                    const products = res.data
                    const brands = [...new Set(products.map((product) => product.brand))]
                    const maxPrice = Math.max(...products.map((product) => product.price))
                    const categories = [...new Set(products.map((product) => product.category))]

                    this.setState({
                        products,
                        filteredProducts: products,
                        brands,
                        maxPrice,
                        priceRange: [0, maxPrice],
                        categories,
                    })
                } else {
                    console.log("Records not found.")
                }
            })
    }

    handleBrandChange = (brand) => {
        const {selectedBrand} = this.state
        const updatedBrands = selectedBrand.includes(brand)
            ? selectedBrand.filter((b) => b !== brand)
            : [...selectedBrand, brand]
        this.setState({selectedBrand: updatedBrands}, this.filterData)
    }

    handlePriceChange = (e) => {
        const priceRange = [...this.state.priceRange]
        priceRange[e.target.name === "min" ? 0 : 1] = Number(e.target.value)
        this.setState({priceRange}, this.filterData)
    }

    handleInStock = () => {
        this.setState((prevState) => ({
            inStock: !prevState.inStock,
        }), this.filterData)
    }

    handleRatingChange = (rating) => {
        const {selectedRating} = this.state
        const updatedRatings = selectedRating.includes(rating)
            ? selectedRating.filter((r) => r !== rating)
            : [...selectedRating, rating]
        this.setState({selectedRating: updatedRatings}, this.filterData)
    }

    handleCategoryChange = (category) => {
        const {selectedCategory} = this.state
        const updatedCategories = selectedCategory.includes(category)
            ? selectedCategory.filter((c) => c !== category)
            : [...selectedCategory, category]
        this.setState({selectedCategory: updatedCategories}, this.filterData)
    }

    filterData = () => {
        const {products, selectedBrand, priceRange, inStock, selectedRating, selectedCategory} = this.state

        let filteredProducts = products.filter((product) => {
            const matchesBrand = selectedBrand.length === 0 || selectedBrand.includes(product.brand)
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
            const matchesStock = !inStock || product.stock > 0
            const matchesRating = selectedRating.length === 0 || selectedRating.includes(product.rating)
            const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(product.category)

            return matchesBrand && matchesPrice && matchesStock && matchesRating && matchesCategory
        })
        this.setState({filteredProducts}, this.sortProducts)
    }

    handleSortChange = (e) => {
        const sortOption = e.target.value
        this.setState({sortOption}, this.sortProducts)
    }

    sortProducts = () => {
        const {filteredProducts, sortOption} = this.state
        let sortedProducts = [...filteredProducts]

        if (sortOption === "bestRated") {
            sortedProducts.sort((a, b) => b.rating - a.rating)
        } else if (sortOption === "aToZ") {
            sortedProducts.sort((a, b) => a.name < b.name ? -1 : 1)
        } else if (sortOption === "zToA") {
            sortedProducts.sort((a, b) => a.name < b.name ? 1 : -1)
        } else if (sortOption === "lowToHigh") {
            sortedProducts.sort((a, b) => a.price - b.price)
        } else if (sortOption === "highToLow") {
            sortedProducts.sort((a, b) => b.price - a.price)
        }
        this.setState({filteredProducts: sortedProducts})
    }

    render() {
        const {brands, priceRange, maxPrice, filteredProducts, inStock, categories, sortOption} = this.state

        return (
            <div className="filterProducts">

                <div className="productsPage">
                    <div className="headingFilterProducts">
                        Entire Collection&nbsp;
                        <span>{filteredProducts.length}</span>
                    </div>
                </div>

                <div className="filters">
                    <div className="filterSortBar">
                        <h6>☰ Filters</h6>

                        {/* sortign */}
                        <div className="sortDropdown">
                            <h6><label htmlFor="sort">Sort By ↕ &nbsp;</label></h6>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={this.handleSortChange}
                            >
                                <option value="none">None Selected</option>
                                <option value="bestRated">Best Rated (5⭐ → 1⭐)</option>
                                <option value="aToZ">A - Z</option>
                                <option value="zToA">Z - A</option>
                                <option value="lowToHigh">Low to High</option>
                                <option value="highToLow">High to Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="filterTag"></div>

                    {/* brands */}
                    <div className="filterSection">
                        <h6>Brands</h6>
                        {brands.slice(0, this.state.allBrands ? this.state.brands.length : 5).map((brand) => (
                            <div key={brand}>
                                <input
                                    type="checkbox"
                                    id={`brand-${brand}`}
                                    checked={this.state.selectedBrand.includes(brand)}
                                    onChange={() => this.handleBrandChange(brand)}
                                />
                                <label htmlFor={`brand-${brand}`}>&ensp;&ensp;{brand}</label>
                            </div>
                        ))}
                        {this.state.brands.length > 5 && (
                            <button
                                onClick={() =>
                                    this.setState((prevState) => ({allBrands: !prevState.allBrands}))
                                }
                            >
                                {this.state.allBrands ? "-🔇 Show Less" : "+🔊 Show More"}
                            </button>
                        )}
                    </div>

                    {/* pricing */}
                    <div className="filterSection">
                        <h6>Price Range</h6>
                        <label>
                            Minimum: <br></br>
                            <input
                                type="number"
                                name="min"
                                value={priceRange[0]}
                                onChange={this.handlePriceChange}
                                min={0}
                                max={priceRange[1]}
                            />
                        </label>
                        <label>&ensp; —— &ensp;</label>
                        <label>
                            Maximum: <br></br>
                            <input
                                type="number"
                                name="max"
                                value={priceRange[1]}
                                onChange={this.handlePriceChange}
                                min={priceRange[0]}
                                max={maxPrice}
                            />
                        </label>
                        <label>&ensp;€</label>
                    </div>

                    <div className="filterSection">
                        <h6>Availability</h6>
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={inStock}
                            onChange={this.handleInStock}
                        />
                        <label htmlFor="inStock">&ensp;&ensp;In Stock </label>
                    </div>

                    {/* ratings */}
                    <div className="filterSection">
                        <h6>Ratings</h6>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star}>
                                <label className="starRating">
                                    <input
                                        type="checkbox"
                                        checked={this.state.selectedRating.includes(star)}
                                        onChange={() => this.handleRatingChange(star)}
                                    />
                                    &ensp;&ensp;{"⭐".repeat(star)}
                                </label>
                            </div>
                        ))}
                    </div>


                    {/* categories */}
                    <div className="filterSection">
                        <h6>Categories</h6>
                        {categories.map((category) => (
                            <div key={category}>
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={this.state.selectedCategory.includes(category)}
                                    onChange={() => this.handleCategoryChange(category)}
                                />
                                <label htmlFor={`category-${category}`}>&ensp;&ensp;{category}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="products">
                    <ProductCard products={filteredProducts}/>
                </div>
                {/*<div className="filterTag"></div>*/}
            </div>
        )
    }
}

//     render() {
//         return (
//             <div>
//
//                 <DisplayAllProducts/>
//             </div>
//         )
//     }
// }