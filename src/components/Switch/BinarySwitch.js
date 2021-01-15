import React, { useEffect, useState } from "react";
import "./binary-switch.scss"

const Switch = ({onChange = () => {}, className, label = null, children, labelPosition = "left"}) =>{
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        onChange(checked)
    }, [checked, onChange])


    return (
        <div className={"c-switch " + className}>
            <label className="c-switch__container">
                <input type="checkbox" 
                       className="c-switch__input"
                       onChange={e => setChecked(e.target.checked)} 
                       checked={checked}/>
                <div className="c-switch__thumb"/>
                <span className={"c-switch__label c-switch__label--" + labelPosition}>
                    {label ? label(checked) : (`${children}  ${checked ? "on" : "off"}`)} 
                </span>
            </label>
        </div>
    )
}

export default Switch