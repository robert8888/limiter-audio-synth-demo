import Menu from "./Menu";

export default function MainMenu(){
    const items = [
        {label: "#", link: "/"},
        {label: "Demo", link: "/demo-synth"},
        {label: "Docs", link: "/documentation"}
    ]

    return <Menu className="c-main-menu" items={items}/>
}