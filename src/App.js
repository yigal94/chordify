import './App.css';
import { useState} from 'react'
import ChordBuilder from './components/ChordBuilder';
import SoundParams from './components/SoundParams';
import NotePlayer from './Sounds';
import { chordToFrequencies } from './Theory';
import ChordPalette from './components/ChordPalette';
import Loop from './components/Loop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

let actx = new AudioContext();
let totalGain = actx.createGain();
totalGain.gain.value = 0.1;
totalGain.connect(actx.destination)
let out = totalGain;

const envelope = {
  attack: 0.5,
  decay: 0.2,
  sustain: 0.7,
  release: 0.2
}

const vibrato = {
  frequency: 3,
  gain: 5
}

function App() {
  const [sound, setSound] = useState({
    type: 'sine',
    envelope: envelope,
    vibrato: vibrato
  })

  const [chords, setChords] = useState([])
  const addChord = chord => {
    console.log(chord, chords)
    setChords([...chords, chord])
  }

  const [editedChordIndex, setEditedChord] = useState(null)
  const editedChord = editedChordIndex == null ? null : chords[editedChordIndex]
  const saveChord = (chord) => {
    if(editedChord == null) {
      console.log("trying to edit null chord")
      return
    }
    const new_chords = [...chords]
    new_chords[editedChordIndex] = chord
    setChords(new_chords)
    setEditedChord(null)
  }

  const player = new NotePlayer(actx, out, sound)

  const playChord = chord => player.playChord(chordToFrequencies(chord), 2)

  const deleteChord = chord => {
    setChords(chords.filter(e => e.id !== chord.id))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="header">
        <h1>Chordify!</h1>
      </div>
      <div className='container'>
        <div className='app'>
          <SoundParams 
            out={out} 
            actx={actx} 
            setSound={setSound} 
            sound={sound} />
          <ChordBuilder 
            player={player} 
            addChord={addChord}
            editedChord={editedChord}
            saveChord={saveChord} />
          <ChordPalette 
            chords={chords} 
            playChord={playChord} 
            deleteChord={deleteChord} 
            setEditedChord={setEditedChord} 
            editedChord={editedChordIndex} />
          <Loop chords={chords} player={player} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
