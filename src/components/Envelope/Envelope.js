import Envelope from "audio/Synth/Envelope";
import Slider from "components/Slider/Slider";
import React, { useCallback, useEffect, useState } from "react";
import "./envelope.scss"

const ADSR = ({onChange = () => {}, name, update, defaultEnvelope = new Envelope()}) => {
    const [state, setState] = useState(
        Envelope.params.reduce((acc, param) => 
            ({...acc, [param]: defaultEnvelope[param]}), 
        {})
    )
    
    const updateParam = useCallback((param, value) =>{
        if(state[param] === value) return;
        onChange(param, value)
        setState(state => ({
            ...state,
            [param]:value,
        }))
        setState(state => state)
    }, [state, setState, onChange])

    useEffect(() =>{
        if(typeof update !== "function") return;
        update(updateParam)
    }, [update, updateParam])

    
    return (
        <div className="c-envelope">
            <fieldset className="c-group">
                <legend className="c-group__title">{`${name}`}</legend>
                {[
                    ["attack", "A"], 
                    ["decay", "D"], 
                    ["sustain", "S"], 
                    ["release", "R"]
                ].map(([param, label]) => 
                    <div className="c-envelope__slider-container"  key={label}>
                        <Slider from={Envelope.defaults[param].min} 
                                to={Envelope.defaults[param].max} 
                                value={state[param]} 
                                title={label}
                                onChange={updateParam.bind(null, param)}/>
                    </div>
                )}
            </fieldset>
        </div>
    )
}

export default ADSR