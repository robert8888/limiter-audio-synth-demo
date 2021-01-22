const { default: classes } = require("utils/classes")

const Col = ({
    children,
    all,
    xs, 
    sm,
    md,
    lg,
    xl,
    xxl,
    className,
}) => {
    
    const classNames = classes([
        className,
        "l-col",
        ["l-col--" + all, all],
        ["l-col--xs-" + xs, xs],
        ["l-col--sm-" + sm, sm],
        ["l-col--md-" + md, md],
        ["l-col--lg-" + lg, lg],
        ["l-col--xl-" + xl, xl],
        ["l-col--xxl-" + xxl, xxl]

    ])

    return (
        <div className={classNames}>
            {children}
        </div>
    )
}

export default Col;