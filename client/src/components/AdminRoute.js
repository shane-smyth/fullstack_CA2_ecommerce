import React from 'react'
import {Route, Redirect } from "react-router-dom"

import {ACCESS_LEVEL_ADMIN} from "../config/global_constants"


const AdminRoute = ({ component: Component, exact, path, ...rest }) =>
    (
        <Route
            exact = {exact}
            path = {path}
            render = {props => localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <Component {...props} {...rest} /> : <Redirect to="/"/> }
        />
    )

export default AdminRoute
