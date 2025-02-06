import React, {Component} from "react"

export default class SearchBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            search: "",

        }
    }

    handleSearchChange = (event) => {
        this.setState({
            search: event.target.value,
        })
    }

    handleKeyPress = (event) => { // https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event
        if (event.key === "Enter") {
            const { search } = this.state

            if (search.trim() !== "") {
                window.location.href=`/shop?search=${encodeURIComponent(search.trim())}`
            }
        }
    }

    render() {
        return (
            <div className="searchBar">
                <div className="searchIcon">
                    <img src="./images/search-symbol.png" alt="search"/>
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="searchInput"
                    value={this.state.search}
                    onChange={this.handleSearchChange}
                    onKeyPress={this.handleKeyPress}
                />
            </div>
        )
    }
}