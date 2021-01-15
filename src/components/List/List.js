import React, { useCallback, useEffect, useState } from "react";
import toRange from "utils/toRange";
import "./list.scss"

const List = ({
    items = [], 
    onChange = () => {}, 
    update,
    value = "Sin", 
    className
}) => {
    const [index, setIndex] = useState(0)

    const prev = useCallback(() => {
        setIndex(i => toRange(i - 1, 0 , items.length -1))
    }, [setIndex, items])

    const next = useCallback(() => {
        setIndex(i => toRange(i + 1, 0 , items.length -1))
    }, [setIndex, items])

    useEffect(() => {
        onChange(items[index], index)
    }, [onChange, index, items])

    const setIndexFromLabel = useCallback((value)=> {
        let index = items.findIndex( item => item.label === value || item.value === value) 
        index = index === -1 ? 0 : index;
        setIndex(index)
    }, [setIndex, items])

    const setIndexFromValue = useCallback((value)=>{
        if(typeof value === "number"){
            setIndex(value)
            return;
        }
        setIndexFromLabel(value)
    }, [setIndex, setIndexFromLabel])

    useEffect(() => {
        setIndexFromValue(value)
    }, [value, setIndexFromValue])

    useEffect(() => {
        if(typeof update !== "function") return;
        update(setIndexFromValue)
    },[update, setIndexFromValue])

    return (
        <div className={"c-list " + className}>
            <ul className="c-list__list">
                {items.map((item, id) => 
                    <li  className="c-list__item" 
                        key={`${item}-${id}`} 
                        style={{transform: `translateY(${index * -100}%)`}}>
                            <span>
                                {item.label}
                            </span>
                    </li>
                )}
            </ul>
            <button className="c-list__button c-list__button--up" onClick={prev}><i/></button>
            <button className="c-list__button c-list__button--down" onClick={next}><i/></button>
        </div>
    )
}

export default List;