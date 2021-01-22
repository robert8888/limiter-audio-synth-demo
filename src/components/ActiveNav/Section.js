import React, { useEffect, useRef } from "react";
import { useNavigationContext } from "./Navigation";

export default function Section({
    children, 
    menu = ["default"],
    className
}){
    const {addSection} = useNavigationContext();
    const ref = useRef();

    useEffect(() => {
        addSection({menu, ref})
    }, [menu, ref, addSection])

    return (
        <div className={"c-navigation__section " + (className || "")} ref={ref}>
            {children}
        </div>
    )
}