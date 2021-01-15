import React from "react";
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom"

import Rack from './rack/Rack';

export default function Router(){

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/docs" exact>
                    {/* <Docs/> */}
                </Route>

                <Route path="/">
                    <Rack/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}