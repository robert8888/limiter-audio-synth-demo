import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"
import "./multi-switch.scss";

const MultiSwitch = ({
    onChange = () => {}, 
    items=[{value: "default", label: "default"}],
    defaultIndex = 0,
    update,
}) => {
    const [index, setIndex] = useState(defaultIndex);
    const container = useRef();

    const onPointerDown = useCallback(() => {
        setIndex(current => {
            return (current + 1) % items.length 
        })
    }, [setIndex, items])

    useLayoutEffect(() => {
        container.current.style.setProperty("--index", index);
    },[index, container])

    useLayoutEffect(() => {
        container.current.style.setProperty("--size", items.length)
    }, [items, container])

    useEffect(() => {
        typeof onChange === "function" && onChange(items[index], index)
    }, [index, onChange, items])

    useEffect(() => {
        if(typeof update !== "function") return;

        update((value) => {
            if(typeof value === "number"){
                setIndex(value)
                return
            }
            let index = items.findIndex(item => item.value = value);
            index = index === -1 ? 0 : index;
            setIndex(index);
        })
    }, [update, items, setIndex])

    return (
        <div className="c-multi-switch" onPointerDown={onPointerDown} ref={container}>
            <div className="c-multi-switch__rail"/>
            <div className="c-multi-switch__thumb"/>
            <span className="c-multi-switch__label">{items[index].label}</span>
        </div>
    )
}

export default MultiSwitch;