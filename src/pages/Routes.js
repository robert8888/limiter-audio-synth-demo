import React from "react";
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom"
import Home from "./home/Home";
import Documentation from "./docs/Documentation";
import Rack from './rack/Rack';

export default function Router(){

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/documentation" exact>
                    <Documentation/>
                </Route>

                <Route path="/demo-synth">
                    <Rack/>
                </Route>

                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}