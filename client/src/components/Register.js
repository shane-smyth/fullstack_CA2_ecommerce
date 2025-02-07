import React, {Component} from "react"
import axios from "axios"
import {Link, Redirect} from "react-router-dom";
import {SERVER_HOST} from "../config/global_constants";

export default class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            isRegistered: false,
        }
    }

    componentDidMount() {
        this.inputToFocus.focus()
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    validateEmail() {
        // valid email pattern
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(String(this.state.email).toLowerCase())
    }

    validatePassword() {
        const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[£!#€$%^&*]).{10,}$/
        return pattern.test(String(this.state.password))
    }

    validateConfirmPassword() {
        return this.state.confirmPassword !== "" && this.state.password !== "" && this.state.confirmPassword === this.state.password
    }

    validate() {
        return {
            email: this.validateEmail(),
            password: this.validatePassword(),
            confirmPassword: this.validateConfirmPassword()
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        axios.post(`${SERVER_HOST}/users/register/`, {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        })
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    }
                    else {
                        console.log("User registered successfully")
                        this.setState({isRegistered: true})
                    }
                }
                else {
                    console.log("Registration failed")
                }
            })
    }

    render() {
        let formInputsState = this.validate()

        return (
            <form className="form-container" onSubmit={this.handleSubmit}>
                {this.state.isRegistered ? <Redirect to="/" /> : null}

                <h2>Register</h2>

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    ref = {input => this.inputToFocus = input}

                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                />

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                />


                <input
                    type="submit"
                    value="Register"
                    className="btn btn-success"
                    disabled={!Object.keys(formInputsState).every(index => formInputsState[index])}
                />
                <Link type="button" to={"/login"}>Login</Link>
                <br/>
                <Link type="button" to={"/"}>Cancel</Link>
            </form>
        )
    }
}