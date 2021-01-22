import useLimiter from "audio/useLimiter";
import Knob from "components/Knob/Knob";
import Switch from "components/Switch/BinarySwitch";
import React from "react";
import "./limiter.scss"

const Limiter = () => {
    const {setLimiterParam} = useLimiter();

    return (
        <div className="c-limiter"> 
            <fieldset className="c-group">
                <legend className="c-group__title">Limiter</legend>
                <div className="c-limiter__knob">
                    <Knob title="thresh"  
                          from={-20} 
                          to={0} 
                          value={-4} 
                          onChange={setLimiterParam.bind(null, "threshold")}/>
                </div>
                <div className="c-limiter__knob">
                    <Knob title="attack" 
                          from={0} 
                          to={0.3}
                          value={0.005} 
                          fixed={3}
                          onChange={setLimiterParam.bind(null, "attack")}/>
                </div>
                <div className="c-limiter__knob" >
                    <Knob title="release" 
                          from={0} 
                          to={.5}
                          value={0.15}
                          onChange={setLimiterParam.bind(null, "release")} 
                          fixed={3} />
                </div>
                <div className="c-limiter__knob">
                    <Knob title="pre gain" 
                          from={-20} 
                          to={20}
                          value={0}
                          onChange={setLimiterParam.bind(null, "preGain")} 
                          symmetric/>
                </div>
                <div className="c-limiter__knob">
                    <Knob title="post gain"
                          from={-20} 
                          to={20}
                          value={0}znv
                          onChange={setLimiterParam.bind(null, "postGain")}
                          symmetric/>
                </div>
                <Switch className="c-limiter__bypass" labelPosition="bottom" onChange={value => setLimiterParam("bypass", +!!value)}>
                    Bypass
                </Switch>
            </fieldset>
        </div>
    )
}

export default Limiter;