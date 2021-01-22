import Text from "components/Text";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from "utils/classes";
import range from "utils/range";
import toRange from "utils/toRange";
import "./knob.scss";

const Knob = ({
    from = 0, 
    to = 1, 
    value = 0, 
    title = "",
    update,  
    onChange = () => {}, 
    response = 150, 
    fixed = 1,
    format = value => value,
    symmetric: isSymmetric = false,
    quantize = null,
}) => {
    const [localValue, setLocalValue] = useState(.5);
    const knob = useRef();
    const [isActive, setIsActive] = useState(false)

    const scale = useCallback((value) => {
        const range = Math.max(from, to) - Math.min(from, to);
        value = range * value + Math.min(from, to);
        if(quantize){
            value = Math.floor(value / quantize) * quantize;
        }

        return value.toFixed(fixed);
    }, [from, to, fixed, quantize])

    const deScale = useCallback((value) => {
        const range = Math.max(from, to) - Math.min(from, to);
        return toRange((value - from) / range, 0, 1)
    }, [from, to])

    const updateValue = useCallback(value => { 
        setLocalValue(toRange(value, 0, 1) )
    }, [setLocalValue])

    useEffect(() => {
        onChange(+scale(localValue))
    }, [localValue, onChange, scale])

    useLayoutEffect(() => {
        const _value = isSymmetric ? localValue - .5 : localValue;
        knob.current.style.setProperty("--to", _value * 280 + "deg")
    }, [localValue, knob, isSymmetric])

    const onPointerDown = useCallback((e) => {
        const startY = e.clientY || (e.touches && e.touches[0].clientY )|| 0;
        const startValue = localValue;

        const onPointerMove = e => {
            const clientY = e.clientY || (e.touches && e.touches[0].clientY )|| 0;
            updateValue(startValue + (startY - clientY) / response);
            if(e.cancelable)
                e.preventDefault();
        }

        const removeEvents = e => {
            window.removeEventListener("mousemove", onPointerMove, {passive: false})
            window.removeEventListener("touchmove", onPointerMove, {passive: false})
            window.removeEventListener("mouseup", removeEvents);
            window.removeEventListener("touchend", removeEvents);
            window.removeEventListener("mouseleave", removeEvents);
            setIsActive(false);
        }

        window.addEventListener("mousemove", onPointerMove, {passive: false})
        window.addEventListener("touchmove", onPointerMove, {passive: false})
        window.addEventListener("mouseup", removeEvents);
        window.addEventListener("touchend", removeEvents);
        window.addEventListener("mouseleave", removeEvents);
        setIsActive(true)
    }, [localValue, updateValue, setIsActive, response])

    useEffect(() => {
        updateValue(deScale(value))
    }, [value, updateValue, deScale])

    useEffect(() =>{
        if(typeof update !== "function") return;
        update(value => updateValue(deScale(value)))
    }, [update, updateValue, deScale])

    const containerClassNames = classes([
        "c-knob",
        ["c-knob--active", isActive],
        ["c-knob--symmetric", isSymmetric]
    ])

    return (
        <div className={containerClassNames} onTouchMove={() => false}>
            <div className="c-knob__container" ref={knob} onPointerDown={onPointerDown}>
                <div className="c-knob__disk">
                    <div className="c-knob__thumb"/>
                </div>
                <div className="c-knob__dot"/>
                <Text className="c-knob__value">
                    {format(scale(localValue))}
                </Text>
  
            </div>
            <div className="c-knob__face">
                <div className="c-knob__ring"/>
                {range(11).map((id) => <div className="c-knob__inc" key={id}/>)}
                <Text className="c-knob__title">
                    {title}
                </Text>
            </div>
        </div>
    )
}

export default Knob;