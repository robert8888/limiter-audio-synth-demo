import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import "./active-navigation.scss";
import set from "utils/set";
import debounce from "utils/debounce";

const NavigationContext = React.createContext(null);

export const useNavigationContext = () => useContext(NavigationContext);

export default function Navigation({children, title}){
    const sections = useRef([])
    const [allSections, setAllSections] = useState(null);
    const [menuItems, setMenuItems] = useState(null) 
    const setActive = useRef();

    useEffect(() => {
        if(!allSections) return;
        const menuStructure = allSections.reduce((acc, current) => 
           set(acc, current.menu, current.ref) 
        , {})
        setMenuItems(menuStructure)
    }, [allSections, setMenuItems])


    useEffect(() => {
        if(!allSections) return;
        const activate = debounce(setActive.current, 500);
        const observer = new IntersectionObserver(entires => {
            const firstIntersecting = entires.find(entry => entry.isIntersecting);
            if(!firstIntersecting) return;
            activate(firstIntersecting.target)
        }, { rootMargin: "-10% 0px -80% 0px"})
        allSections.forEach(section => {
            if(!section?.ref?.current) return;
            observer.observe(section.ref.current)
        });
        return () => {
            observer.disconnect();
        }
    }, [allSections])

    const addSection = useCallback((section) => {
        sections.current.push(section);
        if(sections.current.length === children.length){
            setAllSections(sections.current)
        }
    }, [sections, children, setAllSections])


    const scrollTo = useCallback((element) => {
        if(!element.current) return;
        element.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        setActive.current(element.current)
    }, [setActive])

    return (
        <div className="c-navigation">
            <NavigationContext.Provider value={{addSection}}>
                <Sidebar title={title} items={menuItems} goTo={scrollTo} active={callback => setActive.current = callback }/>
                <div className="c-navigation__container">
                    {children}
                </div>
            </NavigationContext.Provider>
        </div>
    )
}