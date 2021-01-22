import useSynthInput from "audio/useSynthInput";
import React, { useCallback,  useEffect,  useLayoutEffect,  useRef} from "react";
import range from "utils/range";
import Key from "./Key";
import keyboardSvg from "assets/keyboard.svg"
import "./piano.scss";
import toRange from "utils/toRange";


const keyboardShortcut = [
    "z","s","x", "d", "c", "v", "g", "b", "h", "n", "j", "m", ",",
]

const Piano = () => {
    const {noteOn, noteOff} = useSynthInput();
    const keyboardContainer = useRef();
    const keys = useRef({}) 
    const octave = useRef(3)

    //keyboard shortcuts mapping
    useEffect(() => {
        const onKeyDown = e =>{
            const key = e.key.toLowerCase();
            const index = keyboardShortcut.indexOf(key);
            if(index === -1 || e.repeat) return;
            const note = 4 + octave.current * 12 + index;
            noteOn(note, 1);
            keys.current[note].classList.add("c-piano__key--active")
        }

        const onKeyUp = e => {
            const key = e.key.toLowerCase();
            const index = keyboardShortcut.indexOf(key);
            if(index === -1) return;

            const note = 4 + octave.current * 12 + index;
            noteOff(note);
            keys.current[note].classList.remove("c-piano__key--active")
        }

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
        return () => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        }
    }, [noteOn, noteOff, octave])

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

    const changeOctave = useCallback((dir) =>{
        dir = dir === "up" ? 1 : -1;
        octave.current = toRange(octave.current + dir, 0 , 5)
    }, [octave])

    return (
        <div className="c-piano bg-wood">
            <div className="c-piano__board">
                <span className="c-piano__badge">Nightingale  9000</span>
                <div className="c-piano__panel">
                    <div className="c-piano__panel__img__wrapper">
                        <img className="c-piano__panel__img" src={keyboardSvg} alt="keyboard"/>
                    </div>
                    <button className="c-piano__panel__button" onClick={changeOctave.bind(null, "up")}>
                        {"\u25B2"}
                    </button>
                    <button className="c-piano__panel__button" onClick={changeOctave.bind(null, "down")}>
                        {"\u25BC"}
                    </button>
                </div>
            </div>
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