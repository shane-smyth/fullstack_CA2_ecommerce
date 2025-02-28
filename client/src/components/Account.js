import React, {Component} from "react"
import Logout from "./Logout"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
        }
    }

    render() {
        return (
            <div className="accountPage boxes">
                <div className="accountContainer">
                    <div className="accountPageHeader boxes">
                        <Logout />
                        <h1>Account</h1>
                    </div>
                    <div className="accountPageBody boxes">
                        <h2>name</h2>
                    </div>
                    <div className="accountHistory boxes">
                        <h2>Account History</h2>
                    </div>
                </div>
            </div>
        )
    }
}