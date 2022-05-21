
const FirstOctaveValues = [32.70320, 34.64783, 36.70810, 38.89087, 41.20344, 43.65353, 46.24930, 48.99943, 51.91309, 55.00000, 58.27047, 61.73541]
const Notes = {
    "C" : 0,
    "C♯": 1,
    "D♭": 1,
    "D" : 2,
    "D♯": 3,
    "E♭": 3,
    "E" : 4,
    "F" : 5,
    "F♯": 6,
    "G♭": 6,
    "G" : 7,
    "G♯": 8,
    "A♭": 8,
    "A" : 9,
    "A♯": 10,
    "B♭": 10,
    "B" : 11
}

export const typeStr = chord => {
    switch(chord.type) {
        case "Major":
            return ""
        case "Minor":
            return "m"
        case "Diminished":
            if(chord.seventh === "7") {
                return "m"
            }
            return "dim"
        case "Augmented":
            return "aug"
        default:
            return chord.type
    }
}

export const sevStr = chord => {
    if(chord.seventh === "None") {
        return ""
    }

    if(chord.seventh === "Dim7/6") {
        if(chord.type === "Diminished") {
            return "7"
        }
        
        return "6"
    }

    if(chord.seventh === "7" && chord.type === "Diminished") {
        return "7(♭5)"
    }

    if(chord.seventh === "Maj7") {
        return "maj7"
    }

    return chord.seventh
}

export const chordToFrequencies = chord => {
    const root = Notes[chord.root]
    const base_notes = []
    switch(chord.type) {
        case "Major":
            base_notes.push(4, 7);
            break;
        case "Minor":
            base_notes.push(3, 7);
            break;
        case "Diminished":
            base_notes.push(3, 6);
            break;
        case "Augmented":
            base_notes.push(4, 8);
            break;
        case "Sus4":
            base_notes.push(5, 7);
            break;
        case "Sus2":
            base_notes.push(2, 7);
        break;
    }

    switch(chord.seventh) {
        case "7":
            base_notes.push(10);
            break;
        case "Maj7":
            base_notes.push(11);
            break;
        case "Dim7/6":
            base_notes.push(9);
            break;
        case "None":
            break;
    }

    const extension_notes = []
    chord.extensions.forEach(ext => {
        switch(ext) {
            case "♭9":
                extension_notes.push(1)
                break;
            case "9":
                extension_notes.push(2)
                break;
            case "♯9":
                extension_notes.push(3)
                break;
            case "11":
                extension_notes.push(5)
                break;
            case "♯11":
                extension_notes.push(6)
                break;
            case "♭13":
                extension_notes.push(8)
                break;
            case "13":
                extension_notes.push(9)
                break
        }
    })
    extension_notes.sort()

    const octave = 1

    const chord_frequencies = [FirstOctaveValues[root] * 2**octave, FirstOctaveValues[root] * 2**(octave + 1)]
    const note_to_freq = (note, add_octave) => {
        const note_octave = Math.floor((root + note) / 12)
        const norm_note = (root + note) % 12
        return FirstOctaveValues[norm_note] * 2**(note_octave + octave + add_octave)
    }
    
    base_notes.forEach(note => chord_frequencies.push(note_to_freq(note, 2)))
    extension_notes.forEach(note => chord_frequencies.push(note_to_freq(note, 3)))
    return chord_frequencies
}
