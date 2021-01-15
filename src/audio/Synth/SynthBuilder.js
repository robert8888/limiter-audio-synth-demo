import Synth from "./Synth";
import range from "utils/range";
import Envelope from "./Envelope";
import SynthModeBuilder from "./SynthModeBuilder";
import SynthUnitBuilder from "./SynthUnitBuilder";

export default class SynthBuilder{
    constructor(context, UnitBuilder = SynthUnitBuilder){
        this.context = context;
        this.unitBuilder = new UnitBuilder(this.context);
    }

    createSynth(numberOfUnits = 48){
        const state = {
            oscillator: {
                "0": {
                    waveType: "SAW",
                    envelope: new Envelope(),
                    vol: 1
                }, 
                "1": {
                    waveType: "SAW",
                    envelope: new Envelope(),
                    vol: 1
                }, 
            },
            filter: {
                "0": {
                    envelope: new Envelope(),
                    envelopeFreqTarget: 0,
                    frequency: 20_000,
                    gain: 0,
                    Q: 0,
                    type: "lowpass"
                }
            },
            mode: SynthModeBuilder.getSynthConfiguration("Sum"),
        }
        const output = this.context.createGain();

        const units = this._unitFactory(numberOfUnits, state, output)
        
        return new Synth(output, units, state);
    }

    _unitFactory(numberOfUnits, state, output){
        return range(numberOfUnits).map(() => {
            const unit = this.unitBuilder.create(state);
            unit.connect(output);
            return unit;
        })
    }
}

  