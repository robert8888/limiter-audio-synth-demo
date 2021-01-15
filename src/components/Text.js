import React from "react";

const Text = ({children, className}) =>{
    return (
    <svg  className={className} viewBox="0 0 56 18">
            <text x="50%" y="15" textAnchor="middle" fontWeight="lighter">{children}</text>
    </svg>
    )
}

export default React.memo(Text, (prev, next) => prev.children === next.children);