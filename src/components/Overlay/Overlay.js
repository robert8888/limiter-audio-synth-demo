import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./overlay.scss";

const Overlay = ({minWidth, children}) => {
    const resizeObserver = useRef();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        resizeObserver.current = new ResizeObserver((entries) => {
            setVisible(entries[0].contentRect.width <= minWidth)
            
        })
        resizeObserver.current.observe(document.body);
        return () => {
            resizeObserver.current.disconnect()
        }
    }, [resizeObserver, minWidth, setVisible])

    useLayoutEffect(() => {
        visible ? 
             document.documentElement.classList.add("scroll--disabled") :
             document.documentElement.classList.remove("scroll--disabled")
    }, [visible])

    if(!visible) return null;

    return (
        <div className={"c-overlay " + (visible ? "c-overlay--visible" : "")}>
            {children}
        </div>
    )
}

export default Overlay;