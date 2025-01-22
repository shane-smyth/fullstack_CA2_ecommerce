import React, { Component } from "react"
import DisplayAllProducts from "./DisplayAllProducts"

export default class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="hero">
                    <img src="https://as1.ftcdn.net/v2/jpg/03/08/93/46/1000_F_308934657_5Q7cqp8BQSzrJ9DEJQ7G6bJfGAUJqETl.jpg"/>
                </div>

                <body>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At corporis ducimus eum exercitationem,
                        ipsa iste iure, nesciunt nulla, quidem sapiente temporibus velit! Aperiam maxime neque officia,
                        officiis quas sed voluptatum?</p>

                    <DisplayAllProducts />
                </body>
            </div>
        )
    }
}
