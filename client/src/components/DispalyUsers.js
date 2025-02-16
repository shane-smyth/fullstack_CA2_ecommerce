import React, { Component } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import {Link} from "react-router-dom"
import AdminShowUser from "./AdminShowUser";


export default class DisplayUsers extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            selectedUser: null,
            testShowUsers: false,
        }
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/users`)
            .then(res => {
                if (res.data) {
                    this.setState({
                        users: res.data
                    })
                }
                else {
                    console.log("Records not found")
                }
            })
    }

    handleShowUser = (user) => {
        this.setState({ selectedUser: user })
    }

    closeModal = () => {
        this.setState({ selectedUser: null })
    }

    handleEdit = (user) => {
        console.log("Edit")
        this.setState({
            testShowUsers: true,
            selectedUser: user
        })

    }

    confirmDelete = (userId) => {
        if (window.confirm("Are you sure?")) {
            this.handleDelete(userId)
        }
    }

    handleDelete = (id) => {
        axios.delete(`${SERVER_HOST}/users/delete/${id}`)
            .then(res => {
                if (res.data) {
                    if (res.data.error) {
                        console.log(res.data.error)
                    }
                    else {
                        console.log("record deleted")
                        // refreshes the state so when the admin deletes a user, the component refreshes with the deleted user gone
                        this.setState(prevState => ({
                            users: prevState.users.filter(user => user._id !== id)
                        }))
                    }
                }
                else {
                    console.log("record not deleted")
                }
            })
    }

    render() {
        const { users , selectedUser} = this.state

        return (
            <div className="userCardBox">
                {users.map((user, index) => (
                    <div className="cardBody" key={index}>
                        <div className="userImg" onClick={() => this.handleShowUser(user)}>
                            {/*{console.log(user.pfp)}*/}
                            <img src={user.pfp} alt="user profile picture" />
                        </div>
                        <div className="userDetails" onClick={() => this.handleShowUser(user)}>
                            <h2>{user.username}</h2>
                            <h2>{user.email}</h2>
                        </div>
                        <div className="userEdits">
                            <button className="redButton" onClick={() => this.confirmDelete(user._id)}>Delete</button>
                        </div>
                    </div>
                ))}

                {selectedUser && <AdminShowUser user={selectedUser} onClose={this.closeModal} />}
            </div>
        )
    }
}
