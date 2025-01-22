import React, {Component} from "react"


export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav>
                <div className="navLogo">
                    <h2>logo here</h2>
                </div>
                <div className="navMenu">
                    <h2>home</h2>
                    <h2>shop</h2>
                    <h2>about</h2>
                </div>
            </nav>
        )
    }
}