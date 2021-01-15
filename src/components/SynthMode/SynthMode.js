import React, { useMemo } from "react";
import useSynthMode from "audio/useSynthMode";
import MultiSwitch from "components/Switch/MultiSwitch";

const SynthMode = () =>{
    const {
        setSynthMode,
        getModesList,
        registerListener,
    } = useSynthMode();

    const items = useMemo(() => 
        getModesList().map(mode =>({value: mode, label: mode})
     ), [getModesList])

    return (
        <div className="c-synth-mode">
            <MultiSwitch 
                items={items}
                registerListener={callback => registerListener("modeChange", null, callback)}
                onChange={(item) => setSynthMode(item.value)}
            />
        </div>
    )
}

export default SynthMode;