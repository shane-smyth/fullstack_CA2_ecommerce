import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class DeleteUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            redirectToAdminPage: false,
        }
    }

    componentDidMount() {
        axios.delete(`${SERVER_HOST}/users/delete/${this.props.match.params.id}`)
            .then(res => {
            if (res.data) {
                if (res.data.error) {
                    console.log(res.data.error)
                }
                else {
                    console.log("record deleted")
                }
                this.setState({redirectToAdminPage: true})
            }
            else {
                console.log("record not deleted")
            }
        })
    }

    render() {
        return (
            <div>
                {this.state.redirectToAdminPage ? <Redirect to="/adminPage" /> : null}
            </div>
        )
    }
}