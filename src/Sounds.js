import { size } from "lodash";

class NotePlayer {
    constructor(actx, out, sound) {
        this.actx = actx;
        this.out = out;
        this.sound = sound
    }

    playNote(frequency, length, delay = 0) {
        const actx = this.actx
        const out = this.out
        const {type, envelope, vibrato} = this.sound
        const time_to_start = actx.currentTime + delay

        // Vibrato osc and gain
        const detuneOsc = actx.createOscillator()
        detuneOsc.type = "sine"
        detuneOsc.frequency.value = vibrato.frequency
        const detuneGain = actx.createGain()
        detuneGain.gain.linearRampToValueAtTime(vibrato.gain, time_to_start + length/2)
        // detuneGain.gain.setTargetAtTime(0, time_to_start + length, 0.5)
        

        // Main osc
        const osc = actx.createOscillator()
        osc.type = type
        osc.frequency.value = frequency
        
        // Main gain
        const gain = actx.createGain()
        
        // Envelope
        gain.gain.setValueAtTime(0, actx.currentTime)
        gain.gain.setValueAtTime(0, time_to_start)
        gain.gain.linearRampToValueAtTime(1, time_to_start + envelope.attack)
        gain.gain.setTargetAtTime(envelope.sustain, time_to_start + envelope.attack, envelope.decay/2)
        // gain.gain.setValueAtTime(envelope.sustain, time_to_start + length - delay)
        gain.gain.setTargetAtTime(0, time_to_start + length - delay, envelope.release/3)

        // Node Connections
        detuneOsc.connect(detuneGain)
        detuneGain.connect(osc.detune)
        osc.connect(gain)
        gain.connect(out)

        // Play!
        detuneOsc.start()
        osc.start()
        osc.stop(time_to_start + length - delay + 1 + envelope.release*4)
    }

    playChord(frequencies, length, strum = 0.1) {
        const delay = strum/(size(frequencies) - 1)
        frequencies.forEach((element, index) => {
            this.playNote(element, length, Math.min(index * delay, length - 0.2))
        });
    }
}

export default NotePlayer;