import React, {useCallback, useState} from "react";
import { getNoteName, isKeyBlack } from "utils/noteTools";
import classes from "utils/classes";

const Key = React.forwardRef(({note, onKeyDown = () => {}, onKeyUp = () => {}}, ref) =>{  
    const [isBlack] = useState(isKeyBlack(note));
    const [isActive, setIsActive] = useState(false)

    const keyOn = useCallback((force) => {
        setIsActive(true)
        onKeyDown(note, force)
    }, [note, onKeyDown])

    const keyOff = useCallback(() =>{
        setIsActive(false)
        onKeyUp(note)
    }, [note, onKeyUp])

    const onPointerDown = useCallback((e) => {
        const clientY = e.clientY || e.touches?.[0].clientY || 0;
        const rect = (e.target || e.touches?.[0].target)?.getBoundingClientRect();
        
        if(!rect) return;

        const force = (clientY - rect.top) / rect.height;

        keyOn(force);

        const  onPointerEnd = () => { 
            window.removeEventListener("mouseup", onPointerEnd)
            window.removeEventListener("mouseleave", onPointerEnd)
            window.removeEventListener("touchend", onPointerEnd)
            window.removeEventListener("touchcancel", onPointerEnd)
            keyOff();
        }

        window.addEventListener("mouseup", onPointerEnd)
        window.addEventListener("mouseleave", onPointerEnd)
        window.addEventListener("touchend", onPointerEnd)
        window.addEventListener("touchcancel", onPointerEnd)
    }, [keyOn, keyOff])

    const containerClass = classes([
        "c-piano__key",
        ["c-piano__key--white","c-piano__key--black", isBlack],
        ["c-piano__key--active", isActive]
    ])

    return (
        <div ref={ref}
             onPointerDown={onPointerDown} 
             onMouseUp={setIsActive.bind(null, false)} 
             className={containerClass}>
             <span>{getNoteName(note).name + (!isBlack ?  "-" +  getNoteName(note).octave : "")}</span>
        </div>
    )
})

export default Key;