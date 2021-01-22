import ADSR from "components/Envelope/Envelope";
import List from "components/List/List";
import React, { useMemo } from "react";
import waves from "audio/waves"
import "./synth.scss";
import Knob from "components/Knob/Knob";
import useSynthConfigure from "audio/useSynthConfigure";
import MultiSwitch from "components/Switch/MultiSwitch";


const standardWaveForms = ["sine", "triangle", "sawtooth","square", "pulse"]
const Synth = () => {

    const waveList = useMemo(() => {
        const builtIn = standardWaveForms.map((name, index) => ({
            label: name.toUpperCase(),
            index,
            value: name,
        }))
        const additiveWaves = Object.keys(waves).map((waveName, index) => ({
            label: waveName.replace(/([a-z]|(?=[A-Z]))([A-Z0-9])/g, '$1 $2').toUpperCase(),
            index: builtIn.length + index,
            value: waveName,
        }))
        return builtIn.concat(additiveWaves)
    }, [])

    const {
        oscillatorIds,
        setOscEnvelope,
        setOscVol,
        setWaveType,
        setOscTranspose,
        setOscDetune,
        setOscShift,
        filterIds,
        setFilterEnv,
        setFilterEnvAmount,
        setFilterFreq,
        setFilterRes,
        setFilterType,
        setFilterGain,
        registerListener,
    } = useSynthConfigure();    

    return (
        <div className="c-synth">
            {filterIds().map(id => 
                 <div className="c-synth__filter" key={id}>
                    <div className="c-synth__group">
                        <div className="c-synth__filter__knob">
                            <Knob title="FREQ" 
                                  from={0} to={20_000} 
                                  value={4_000}
                                  fixed={0}
                                  update={callback => registerListener("filterFrequencyChange", id, callback)} 
                                  onChange={setFilterFreq.bind(null, id)}/>
                        </div>
                        <div className="c-synth__filter__knob">
                            <Knob title="RESO" 
                                  from={0} to={40}
                                  value={3}
                                  update={callback => registerListener("filterResonanceChange", id, callback)} 
                                  onChange={setFilterRes.bind(null, id)}/>
                        </div>
                        <div className="c-synth__filter__knob">
                            <Knob title="ENV" 
                                  from={-5000}
                                  to={5000}
                                  value={-2000}
                                  symmetric
                                  fixed={0}
                                  update={callback => registerListener("filterEnvelopeAmountChange", id, callback)}
                                  onChange={setFilterEnvAmount.bind(null, id)}/>
                        </div>
                    </div>
                    <div className="c-synth__group c-synth__group--filter-type">
                        <MultiSwitch 
                                  onChange={item => setFilterType(id, item.value)}
                                  update={callback => registerListener("filterTypeChange", id, callback)}  
                                  items={[
                                      {value: "lowpass", label: "lowpass"}, 
                                      {value: "bandpass", label: "bandpass"}, 
                                      {value: "highpass", label: "highpass"}
                                    ]}/>
                    </div>
                    <ADSR name="FL Envelope"
                          update={callback => registerListener("filterEnvelopeParamChange", id, callback)} 
                          onChange={setFilterEnv.bind(null, id)}/>
                </div>
            )}
            {oscillatorIds().map(id => 
                <div className="c-synth__oscillator" key={id}>
                    <div className="c-synth__group">
                        <List className="c-list--waves" 
                              items={waveList} 
                              defaultValue={0} 
                              update={callback => registerListener("oscillatorWaveChange", id, callback)} 
                              onChange={item => setWaveType(id, item.value)}/>
                        <div className="c-synth__oscillator__knob">
                            <Knob from={0} to={1} value={.6} fixed={3}
                                  update={callback => registerListener("oscillatorVolumeChange", id, callback)}  
                                  onChange={setOscVol.bind(null, id)} title="Vol"/>
                        </div>
                    </div>
                    <div className="c-synth__group">
                        <div className="c-synth__oscillator__knob">
                            <Knob title="Trans"
                                  from={-24} to={24} value={0}
                                  update={callback => registerListener("oscillatorTransposeChange", id, callback)}  
                                  onChange={setOscTranspose.bind(null, id)}
                                  fixed={0}
                                  quantize={1} 
                                  symmetric/>
                        </div>
                        <div className="c-synth__oscillator__knob">
                            <Knob title="Detune"
                                  from={-1} to={1} value={0}
                                  update={callback => registerListener("oscillatorDetuneChange", id, callback)}  
                                  onChange={setOscDetune.bind(null, id)} 
                                  fixed={2}
                                  symmetric/>
                        </div>
                        <div className="c-synth__oscillator__knob">
                            <Knob title="Shift"
                                  from={-.5} to={.5} value={0}
                                  update={callback => registerListener("oscillatorShiftChange", id, callback)}  
                                  onChange={setOscShift.bind(null, id)} 
                                  fixed={3}
                                  symmetric/>
                        </div>
                    </div>
                    <ADSR onChange={setOscEnvelope.bind(null, id)} name="Envelope"/>
                </div>
            )}
        </div> 
    )
}

export default Synth;