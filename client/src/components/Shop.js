import React, { Component } from "react"
import { Link } from "react-router-dom"

import DisplayAllProducts from "./DisplayAllProducts"

export default class Shop extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>

                <DisplayAllProducts/>
            </div>
        )
    }
}