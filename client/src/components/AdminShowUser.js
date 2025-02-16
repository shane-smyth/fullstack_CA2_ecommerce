import React, {Component} from "react"


export default class AdminShowUser extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {user, onClose} = this.props

        if (!user) {return null}
        return (
            <div className="modalOverlay">
                <div className="modalContent">
                    <button className="closeButton" onClick={onClose}>✖</button>
                    <div className="modalBody">
                        <div className="userModalDetailsBox">
                            <img className="userImg" src={user.pfp} alt="User Profile" />
                            <div className="userModalDetails">
                                <h2>{user.username}</h2>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className="userModalHistory">
                            <h3>History</h3>
                            <p>More user details can go here...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}