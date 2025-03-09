import React, { Component } from "react"

export default class Toast extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            message: "",
        }
    }

    showError = (message) => {
        this.setState({visible: true, message})
        setTimeout(() => {
            this.setState({visible: false, message: ""})
        }, 5000) // hide after 5 seconds
    }

    render() {
        return (
            <div className={`toast ${this.state.visible ? "show" : ""}`}>
                {this.state.message}
            </div>
        )
    }
}