import React, { useCallback, useEffect, useRef, useState } from "react";
import toRange from "utils/toRange";
import "./slider.scss";

const Slider = ({onChange = () => {}, from =0 , to = 1, title = "", value = 0}) =>{
    const thumb = useRef();
    const area = useRef();
    const localValue = useRef()
    const [isActive, setIsActive] = useState(false);
    
    const updateValue = useCallback( percentage => {
        const range = Math.max(from, to) - Math.min(from, to);
        const v = Math.min(from, to) + range * percentage;
        localValue.current = v;
        onChange(v);
    }, [onChange, from, to])

    const percentageValue = (clientY, topOffset, height) => {
         const value = (height - (clientY - topOffset)) / height;
         return toRange(value, 0, 1)
    }

    const setPosition = useCallback((position) => {
        const height = thumb.current.getBoundingClientRect().height / 2
        thumb.current.style.transform = `translateY(${-position + height}px)`
    }, [thumb]);

    
    const updateView = useCallback((percentage, height) => {
        setPosition(percentage  * height);
        updateValue(percentage)
    }, [setPosition, updateValue])

    const onPointerDown = useCallback((e) => {
        const areaRect = area.current.getBoundingClientRect();
        const startY = e.clientY;
        const percentage = percentageValue(startY, areaRect.top, areaRect.height)
        updateView(percentage , areaRect.height);

        const onPointerMove = (e) =>{
            const clientY = e.clientY;
            const percentage = percentageValue(clientY, areaRect.top, areaRect.height)
            updateView(percentage, areaRect.height);
        }

        window.addEventListener("mousemove", onPointerMove)
        window.addEventListener("mouseup", function mouseUp(){
            window.removeEventListener("mouseup", mouseUp)
            window.removeEventListener("mousemove", onPointerMove);
            setIsActive(false)
        })
        setIsActive(true)
    }, [area, updateView, setIsActive])

    useEffect(() => {
        if(from > to){
            console.warn(`Slider expects to value of from: ${from} be smaller than ${to}`)
        }
        const percentage = value / (Math.max(from, to) - Math.min(from, to)); 
        const areaRect = area.current.getBoundingClientRect();

        updateView(toRange(percentage, 0, 1), areaRect.height);
    }, [from, to, value, area, updateView])

    return (
        <div className={"c-slider" + (isActive ? " c-slider--active" : "")}>
            <div className="c-slider" ref={area} onPointerDown={onPointerDown}>
                <div className="c-slider__thumb" ref={thumb} />
                <div className="c-slider__axis"/>
            </div>
            <span className="c-slider__title">
                {title}
            </span>
        </div>
    )
}

export default React.memo(Slider, (prev, next) => prev.value === next.value);