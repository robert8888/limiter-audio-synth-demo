export function getNoteFreq(note, detune = 0, masterTune = 440, transpose = 0){
    const power = note - 48 + transpose + detune;
    const frequency = masterTune * (Math.pow(2,(power/12)));
    return frequency;
}

export function isKeyBlack(note){
    const blacks = [0, 2, 5, 7, 10, 12];
    return blacks.some(black => note % 12 === black)
}

export function getNoteName(note){
    const notes = ["G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F","F#", "G"]
    const name = notes[note % 12];
    const octave = ~~(note / 12)
    return {name, octave}
}