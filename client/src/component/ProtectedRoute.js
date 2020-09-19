import React from 'react'
import { Redirect } from 'react-router-dom'
function ProtectedRoute(props) {

    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');
    //console.log(Component)
    return (
        <>
            {isAuthenticated ? <Component/> : <Redirect to={{ pathname: '/' }}/>}
        </>
    )
}

export default ProtectedRoute
