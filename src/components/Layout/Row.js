

const Row = ({children, className}) => {

    return (
        <div className={"l-row " + (className || "")}>
            {children}
        </div>
    )
}

export default Row;