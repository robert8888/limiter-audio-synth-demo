import React from "react";
import "./layout.scss";

const Layout = ({children}) =>{
    return (
        <div className="l-container">
            <div className="l-content">
                {children}
            </div>
        </div>
    )
}


export default Layout;