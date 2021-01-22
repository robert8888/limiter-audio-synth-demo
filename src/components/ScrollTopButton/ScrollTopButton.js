import { useCallback } from "react"
import "./scroll-top-button.scss"

export default function ScrollTopButton(){
    const scrollTop = () => {
        window.scrollTo({top:0 , behavior: "smooth"})
    }
    return <button className="c-scroll-top-btn" onClick={scrollTop}>{"\u25B2"}</button>
}