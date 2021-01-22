import Overlay from "components/Overlay/Overlay";
import rotateLogo from "assets/rotate.svg"
import "./mobile-rotate-overlay.scss"

const MobileRotateOverlay = () => {
    return (                
        <Overlay minWidth={600}>
            <div className="mobile-overlay__wrapper">
                 <img className="mobile-overlay__img" src={rotateLogo} alt="rotate logo"/>
            </div>
        </Overlay>
    )
}

export default MobileRotateOverlay;