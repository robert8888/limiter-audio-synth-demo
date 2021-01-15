import EventTarget from "utils/EventTarget";
import { getNoteFreq } from "utils/noteTools";
import SynthModeBuilder from "./SynthModeBuilder";


export default class Synth extends EventTarget{
    _running = {};
    
    constructor(output, units, state){
        super();
        this._output = output;
        this._units = units;
        this._state = state;

    }

    get output(){
        return this._output;
    }

    connect(node){
        this._output.connect(node);
    }

    disconnect(){
        this._output.disconnect();
    }

    noteOn(note, force){
        const unit = this._units.find(unit => !unit.isBusy);

        if(!unit) return;
        
        const freq = getNoteFreq(note);
        unit.start(freq, force);
        if(this._running[note] && this._running[note].length){
            this._running[note].push(unit);
        } else {
            this._running[note] = [unit]
        }

        unit.onEnd = (id) => {
            const index = this._running[note].findIndex(unit => unit.id === id);
            this._running[note].splice(index, 1);
        }
    }

    noteOff(note){
        const units = this._running[note];
        if(!units) return;
        units.forEach(unit => unit.stop());
    }

    get oscillatorIds(){

      return this._units[0].oscillatorIds;
    }

    get filterIds(){
        return this._units[0].filterIds;
    }

    getAvailableSynthModes(){
        return SynthModeBuilder.getSynthModesNames();
    }

    setSynthMode(name){
        const mode = SynthModeBuilder.getSynthConfiguration(name);
        this._state.mode = mode;
        this.fire("modeChange", name)
    }

    setOscillatorEnvelope(id, param, value){
        if(this._state.oscillator[id].envelope[param] === value) return;

        this._state.oscillator[id].envelope[param] = value;
        this.fire("oscillatorEnvelopeParamChange", id, param, value)
    }

    setOscillatorVolume(id, value){
        if(this._state.oscillator[id].vol === value) return;

        this._state.oscillator[id].vol = value;
        this.fire("oscillatorVolumeChange", id, value)
    }

    setOscillatorWaveType(id, waveTypeName){
        if(this._state.oscillator[id].waveType === waveTypeName) return;

        this._state.oscillator[id].waveType = waveTypeName;
        this.fire("oscillatorWaveChange", id, waveTypeName)
    }

    setFilterEnvelope(id, param, value){
        if(this._state.filter[id].envelope[param] === value) return;

        this._state.filter[id].envelope[param] = value;
        this.fire("filterEnvelopeParamChange", id, param, value)
    }

    setFilterEnvelopeAmount(id, value){
        if(this._state.filter[id].envelopeFreqTarget === value) return;

        this._state.filter[id].envelopeFreqTarget = value;
        this.fire("filterEnvelopeAmountChange", id, value)
    }

    setFilterFreq(id, value){
        if(this._state.filter[id].frequency === value) return;

        this._state.filter[id].frequency = value;
        this.fire("filterFrequencyChange", id, value)
    }

    setFilterRes(id, value){
        if(this._state.filter[id].Q === value) return;

        this._state.filter[id].Q = value;
        this.fire("filterResonanceChange", id, value)
    }

    setFilterGain(id, value){
        if(this._state.filter[id].gain === value) return;

        this._state.filter[id].gain = value;
        this.fire("filterGainChange", id, value)
    }

    setFilterType(id, type){
        if(this._state.filter[id].type === type) return;

        this._state.filter[id].type = type;
        this.fire("filterTypeChange",id, type)
    }
}