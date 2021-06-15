import { useEffect, useMemo, useState } from "react";
import ReactDom from "react-dom";
import "./modal.scss";

export default function Modal({
    open = true, 
    once = true,
    confirmButtonText, 
    children,
}){
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(once && localStorage.getItem("modal-was-open")) return;
        setIsOpen(open);
        localStorage.setItem("modal-was-open", true);
    }, [setIsOpen, open, once])


    const modal = useMemo(() => {
        return (
            <div className="c-modal">
                <button className="c-modal__btn c-modal__btn--close" onClick={setIsOpen.bind(null, false)}>{"\u2716"}</button>
                <div className="c-modal__container">
                    {children}
                </div>
                { confirmButtonText &&
                  <button 
                      className="c-modal__btn c-modal__btn--confirm" 
                      onClick={setIsOpen.bind(null, false)}>
                          {confirmButtonText}
                  </button>
                }
            </div>
        )
    }, [children, setIsOpen, confirmButtonText])

    if(!isOpen) return null;

    return ReactDom.createPortal(modal, document.getElementById("root").firstChild);
}