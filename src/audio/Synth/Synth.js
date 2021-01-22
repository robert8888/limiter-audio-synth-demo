import EventTarget from "utils/EventTarget";
import toRange from "utils/toRange";
import SynthModeBuilder from "./SynthModeBuilder";


export default class Synth extends EventTarget{
    _running = {};
    
    constructor(output, state){
        super();
        this._output = output;
        this._state = state;

    }

    set units(units){
        this._units = units;
    }

    set unitFactory(factoryMethod){
        this._getUnit = factoryMethod;
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
        let unit;
        if(this._units){
            unit = this._units.find(unit => !unit.isBusy);
        } else {
            unit = this._getUnit();
        }

        if(!unit) return;
        
        unit.start(note, force);
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

      return [0,1]///this._units[0].oscillatorIds;
    }

    get filterIds(){
        return [0]//this._units[0].filterIds;
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

    setOscillatorTranspose(id, transpose){
        if(this._state.oscillator[id].transpose === transpose) return;

        this._state.oscillator[id].transpose = transpose;
        this.fire("oscillatorTransposeChange", id, transpose)
    }

    setOscillatorDetune(id, detune){
        if(this._state.oscillator[id].detune === detune) return;

        this._state.oscillator[id].detune = detune;
        this.fire("oscillatorDetuneChange", id, detune)
    }

    setOscillatorShift(id, shift){
        shift = toRange(shift, -1, 1);
        if(this._state.oscillator[id].shift === shift) return;

        this._state.oscillator[id].shift = shift;
        this.fire("oscillatorShiftChange", id, shift)
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