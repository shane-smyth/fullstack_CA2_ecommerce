import React, {Component} from "react"

export default class SearchBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="searchBar">
                <div className="searchIcon">
                    <img src="./images/search-symbol.png" alt="search"/>
                </div>
                <input type="text" placeholder="Search" className="searchInput"/>
            </div>
        )
    }
}