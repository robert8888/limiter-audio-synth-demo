import useAudioContext from "./AudioContext"
import useSynthCallbackRegistry from "./useSynthCallbackRegistry"

export default function useSynthConfigure(){
    const {synth} = useAudioContext()
    const registerListener = useSynthCallbackRegistry(synth)

    return {
        setOscEnvelope: synth.setOscillatorEnvelope.bind(synth),
        setOscVol: synth.setOscillatorVolume.bind(synth),
        setOscTranspose: synth.setOscillatorTranspose.bind(synth),
        setOscDetune: synth.setOscillatorDetune.bind(synth),
        setOscShift: synth.setOscillatorShift.bind(synth),
        setWaveType: synth.setOscillatorWaveType.bind(synth),
        setFilterEnv: synth.setFilterEnvelope.bind(synth),
        setFilterEnvAmount: synth.setFilterEnvelopeAmount.bind(synth),
        setFilterFreq: synth.setFilterFreq.bind(synth),
        setFilterRes: synth.setFilterRes.bind(synth),
        setFilterGain: synth.setFilterGain.bind(synth),
        setFilterType: synth.setFilterType.bind(synth),
        filterIds: () => synth.filterIds,
        oscillatorIds: () => synth.oscillatorIds,

        registerListener
    }
}