import React, {Component} from "react"


export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav>
                <div className="navLogo">
                    <img id="logo" src="/images/echoharmonics.png" />
                    {/*<h2>logo</h2>*/}
                </div>
                <div className="navSearch">
                    <input type="text" id="search" placeholder="Search"/>
                {/*thinking about maybe a submit button
                but is masked as a magnifying glass for the search bar*/}
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