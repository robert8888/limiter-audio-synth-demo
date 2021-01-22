import { useCallback, useEffect, useMemo, useRef } from "react"

export default function Sidebar({items, goTo = () => {}, active = () => {}, title}){
    const menuItemsReference = useRef(new WeakMap())
    const lastActive = useRef();
    const tabIndex = useRef(0);
    const navContainer = useRef();

    const scrollTo = useCallback((element) => {
        const rect = element.getBoundingClientRect();
        const height = navContainer.current.offsetHeight;
        const offsetTop = navContainer.current.offsetTop;
        let diff;
        if(rect.bottom < offsetTop){
            diff = rect.bottom - offsetTop - rect.height;
        } else if(rect.top > offsetTop + height - 10){  // i ' don't know why but it need additional approx 5 - 10px; 
            diff =  rect.top - offsetTop - height + 2 * rect.height;
        }
        if(diff){
            navContainer.current.scrollTop += diff;
        }
    }, [navContainer])

    useEffect(() => {
        active((target) => {
            const navigationItem = menuItemsReference.current.get(target);
            if(!navigationItem) return;
            if(lastActive.current)
                lastActive.current.classList.remove("c-navigation__item--active");
            lastActive.current = navigationItem;
            navigationItem.classList.add("c-navigation__item--active");
            scrollTo(navigationItem);
        }) 
    }, [active, menuItemsReference, lastActive, scrollTo])

    const renderItem = useCallback((label, to) => {
        return (
            <li className="c-navigation__item" 
                key={label} 
                ref={ref => to.current &&  menuItemsReference.current.set(to.current, ref)}
                tabIndex={tabIndex.current++}>
                <button 
                    className="c-navigation__item__button" 
                    onClick={goTo.bind(null, to)}>
                        {label}
                </button>
            </li>
        )
    }, [menuItemsReference, goTo]);

   
    const renderList = useCallback((items) => {
        return (
        <ul className="c-navigation__list">
            {
                Object.entries(items).map(([key, value]) => {
                    if("current" in value){
                        return renderItem(key, value)
                    } else {
                        return (
                            <li className="c-navigation__item c-navigation__item--group" key={key}>
                                <h6 className="c-navigation__item__label"
                                       onClick={goTo.bind(null, Object.entries(value)?.[0]?.[1])}>
                                    {key}
                                </h6>
                                {renderList(value)}
                            </li>
                        )
                    }
                })
            }
        </ul>
        )
    }, [renderItem, goTo])


    const content = useMemo(() => {
        if(!items || typeof items !== "object") return;
        return renderList(items)
    }, [items, renderList])

    const onPointerDown = useCallback((e) => {
        const sidebar = e.target;

        const onWindowPointerDown = e => {
            if(e.target.closest(".c-navigation__sidebar")) return;
            window.removeEventListener("pointerdown", onWindowPointerDown);
            sidebar.classList.add("c-navigation__sidebar--collapsed")
        }
        if(!sidebar.classList.contains("c-navigation__sidebar--collapsed")) return;
        
        window.addEventListener("pointerdown", onWindowPointerDown);
        sidebar.classList.remove("c-navigation__sidebar--collapsed")
    }, [])

    return (
        <div className="c-navigation__sidebar c-navigation__sidebar--collapsed" onPointerDown={onPointerDown}>
            <h6 className="c-navigation__sidebar__title">{title}</h6>
            <nav className="c-navigation__sidebar__nav" ref={navContainer}>
                {content}
            </nav>
        </div>
    )
}