import React, { useEffect, useState, useRef } from 'react'

import ChordLoopBox from './ChordLoopBox';
import { chordToFrequencies } from '../Theory';
import LoopGridCell from './LoopGridCell';
import LoopControls from './LoopControls';

function Loop({ chords, player }) {
    const [beat, setBeat] = useState(0)
    const [numBeats, setNumBeats] = useState(16)

    const [chordSched, setChordSched] = useState([]);

    const loopRef = useRef(null)
    const loopPlayRef = useRef(null)

    const updateSchedule = (index, optype, offset, orig_bounds) => {
        const beatSize =
            (loopRef.current.getBoundingClientRect().width -
                loopPlayRef.current.getBoundingClientRect().width) / numBeats
        const beatOffset = Math.round(offset / beatSize)
        const newBounds = { ...chordSched[index] }
        if (optype === "resizeRight") {
            newBounds.end = Math.min(
                Math.max(orig_bounds.end + beatOffset, newBounds.start),
                index === chordSched.length - 1 ? numBeats - 1 : chordSched[index + 1].start - 1
            )
        } else if (optype === "resizeLeft") {
            newBounds.start = Math.max(
                Math.min(orig_bounds.start + beatOffset, newBounds.end),
                index === 0 ? 0 : chordSched[index - 1].end + 1
            )
        }
        console.log(newBounds, index, optype, offset, beatOffset, beatSize, orig_bounds, index, chordSched.length - 1, index === chordSched.length - 1)
        const newSched = [...chordSched]
        newSched[index] = newBounds
        setChordSched(newSched)
    }

    const addChord = (index, chord) => {
        const isLegal = chordSched.every(({ start, end }) => (index < start || index > end))
        if (!isLegal) {
            return
        }

        const newChord = { chord: chord, start: index, end: index }
        const place = chordSched.findIndex(
            element => index < element.start
        )
        if (place === -1) {
            newChord.end = Math.min(newChord.start + 3, numBeats - 1)
            setChordSched([...chordSched, newChord])
            return
        }

        newChord.end = Math.min(newChord.start + 3, chordSched[place].start - 1)
        const newSched = [...chordSched]
        newSched.splice(place, 0, newChord)
        setChordSched(newSched)
    }

    const removeChord = index => {
        const newSched = [...chordSched]
        newSched.splice(index, 1)
        setChordSched(newSched)
    }

    const grid_lines = []
    for (let index = 0; index < numBeats; index++) {
        const isCurrent = beat === (index) % numBeats
        grid_lines.push(
            <LoopGridCell isCurrent={isCurrent} key={index} index={index} onClick={() => setBeat(index)} addChord={addChord} />
        )
    }

    return (
        <div className='loop' ref={loopRef}>
            <div ref={loopPlayRef}>
                <LoopControls
                    chordSched={chordSched}
                    numBeats={numBeats}
                    setNumBeats={setNumBeats}
                    beat={beat}
                    setBeat={setBeat}
                    player={player}
                />
            </div>
            {grid_lines}
            {chordSched.map((chord, index) =>
                <ChordLoopBox
                    chord={chord.chord}
                    index={index}
                    key={chord.id}
                    start={chord.start}
                    end={chord.end}
                    updateSched={updateSchedule}
                    removeChord={removeChord}
                />)}
        </div>
    )
}

export default Loop