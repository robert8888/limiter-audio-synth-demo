import MainMenu from "components/Menu/MainMenu";
import React from "react";
import Col from "./Col";
import "./layout.scss";
import Row from "./Row";

const Layout = ({children}) =>{
    return (
        <div className="l-container">
            <div className="l-content">
                <Row>
                    <Col all={12} className="l--right">
                        <MainMenu/>
                    </Col>
                </Row>

                {children}
            </div>
        </div>
    )
}


export default Layout;