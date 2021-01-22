import useMixer from "audio/useMixer";
import Knob from "components/Knob/Knob";
import PeakMeter from "components/PeakMeter/PeakMeter";
import React from "react";
import "./master.scss";

const Master = () => {
    const {
        getLevelMeter,
        setVolume,
    } = useMixer();
    return (
        <div className="c-mixer">
            <div className="c-mixer__grid">
                <div className="c-mixer__knob-gain">
                    <Knob title="Gain" from={0} to={2} value={1} onChange={setVolume}/>
                </div>
                <div className="c-mixer__peak-meter c-mixer__peak-meter--master">
                    <PeakMeter size={22} zero={16} text="LIMITED" updateMeter={getLevelMeter.bind(null, "limited")} orientation="vertical"/>
                </div>
                <div className="c-mixer__peak-meter c-mixer__peak-meter--limit">
                    <PeakMeter size={22} zero={16} zbcc text="MASTER" orientation="vertical" updateMeter={getLevelMeter.bind(null, "master")}/>
                </div>
            </div>
        </div> 
    )
}

export default Master;