import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"


export default class Login extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            email:"",
            password:"",
            isLoggedIn:false
        }
    }

    componentDidMount() {
        this.inputToFocus.focus()
    }

    handleChange = (e) =>
    {
        this.setState({[e.target.name]: e.target.value})
    }


    handleSubmit = (e) =>
    {
        e.preventDefault()

        axios.post(`${SERVER_HOST}/users/login`, {
            email: this.state.email,
            password: this.state.password,
        })
            .then(res =>
            {
                if(res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    }
                    else {
                        console.log("User logged in")

                        localStorage.name = res.data.name
                        localStorage.accessLevel = res.data.accessLevel
                        localStorage.token = res.data.token

                        this.setState({isLoggedIn:true})
                        window.location.reload(true) //https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react
                    }
                }
                else {
                    console.log("Login failed")
                }
            })
    }


    render()
    {
        return (
            <div className="loginRegisterForm">
                <form noValidate = {true}>
                    <div className="loginRegisterCentre">
                        <h1>Login</h1>
                    </div>

                    {this.state.isLoggedIn ? <Redirect to="/"/> : null}
                    <div className="labelInput">
                        <label>Email:</label>
                        <input
                            type = "email"
                            name = "email"
                            placeholder = "Email"
                            autoComplete="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            ref = {input => this.inputToFocus = input}
                        />
                    </div>

                    <div className="labelInput">
                        <label>Password</label>
                        <input
                            type = "password"
                            name = "password"
                            placeholder = "Password"
                            autoComplete="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="loginRegisterCentre">
                        <button className="greenButton" onClick={this.handleSubmit}>Login</button>
                        <Link to="/register">Register</Link>
                        <Link className="red-button" to="/">Cancel</Link>
                    </div>
                </form>
            </div>
        )
    }
}