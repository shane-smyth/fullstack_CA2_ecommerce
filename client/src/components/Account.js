import React, {Component} from "react"
import Logout from "./Logout"


export default class Account extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>Account</h1>
                <Logout />
            </div>
        )
    }
}