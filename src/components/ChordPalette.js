import React from 'react'
import ChordBox from './ChordBox'

function ChordPalette({ chords, playChord, deleteChord, setEditedChord, editedChord }) {
  return (
    <div className="sound">
        <h2>Chord Palette</h2>
        <div className="chordgrid">
          {chords.map((chord, index) => 
              <ChordBox 
                chord={chord} 
                key={chord.id} 
                play={playChord} 
                deleteChord={deleteChord} 
                index={index}
                setEditChord={setEditedChord}
                editedChord={editedChord}
                 />
            )
          }
        </div>
        
    </div>
  )
}

export default ChordPalette