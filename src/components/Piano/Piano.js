import useSynthInput from "audio/useSynthInput";
import React, { useCallback,  useEffect,  useLayoutEffect,  useRef} from "react";
import range from "utils/range";
import Key from "./Key";
import "./piano.scss"

const keyboardShortcut = {
    "z": 40,
    "s": 41,
    "x": 42, 
    "d": 43, 
    "c": 44, 
    "v": 45, 
    "g": 46, 
    "b": 47, 
    "h": 48, 
    "n": 49, 
    "j": 50, 
    "m": 51, 
    ",": 52
}

const Piano = () => {
    const {noteOn, noteOff} = useSynthInput();
    const keyboardContainer = useRef();
    const keys = useRef({}) 
    //keyboard shortcuts mapping
    useEffect(() => {
        const onKeyDown = e =>{
            const key = e.key.toLowerCase();
            const note = keyboardShortcut[key];
            if(!note || e.repeat) return;

            noteOn(note, 1);
            keys.current[note].classList.add("c-piano__key--active")
        }

        const onKeyUp = e => {
            const key = e.key.toLowerCase();
            const note = keyboardShortcut[key];
            if(!note) return;
    
            noteOff(note);
            keys.current[note].classList.remove("c-piano__key--active")
        }

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
        return () => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        }
    }, [noteOn, noteOff])

    const onKeyDown = useCallback((note, force) => {
        noteOn(note, force)
    }, [noteOn])

    const onKeyUp = useCallback((note) => {
        noteOff(note)
    }, [noteOff])
 
    // scrolling horizontal piano keyboard
    const onPointerDown = useCallback((e) => {
        const startX = e.clientX || (e.touches && e.touches[0]?.clientX )|| 0;
        const startLeft = keyboardContainer.current.scrollLeft;

        const pointerMove = (e) => {
            const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
            const delta = startX - clientX;
            keyboardContainer.current.scrollLeft = startLeft + delta
        }

        const removeEvents = () => {
            window.removeEventListener("mousemove", pointerMove)
            window.removeEventListener("touchmove", pointerMove)
            window.removeEventListener("mouseup", removeEvents);
            window.removeEventListener("touchend", removeEvents)
        }

        window.addEventListener("mousemove", pointerMove)
        window.addEventListener("touchmove", pointerMove)
        window.addEventListener("mouseup", removeEvents);
        window.addEventListener("touchend", removeEvents)
     }, [keyboardContainer])

    useLayoutEffect(() => {
        keyboardContainer.current.scrollLeft = 1350;
    }, [keyboardContainer]) 

    return (
        <div className="c-piano bg-wood">
            <div className={"c-piano__container"} ref={keyboardContainer}>
                <div className="c-piano__wrapper" onPointerDown={onPointerDown}>
                    {range(1,88).map((note) => 
                        <Key note={note} key={`${note}`} 
                             ref={ref => keys.current[note] = ref} 
                             onKeyDown={onKeyDown} onKeyUp={onKeyUp}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Piano;