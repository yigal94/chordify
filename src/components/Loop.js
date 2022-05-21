import React, { useEffect, useState, useRef } from 'react'
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChordLoopBox from './ChordLoopBox';
import { chordToFrequencies } from '../Theory';

function Loop({ chords, player }) {
    const [playing, setPlaying] = useState(false)
    const [bpm, setBpm] = useState(100)
    const [beat, setBeat] = useState(0)
    const [numBeats, setNumBeats] = useState(16)
    const interval = useRef(null)
    const [chordSched, setChordSched] = useState([
        { index: 0, start: 0, end: 3 },
        { index: 1, start: 4, end: 7 },
        { index: 2, start: 8, end: 11 },
        { index: 3, start: 12, end: 15 }
    ]);

    const loopRef = useRef(null)
    const loopPlayRef = useRef(null)

    const updateSchedule = (index, optype, offset, orig_bounds) => {
        const beatSize = 
            (loopRef.current.getBoundingClientRect().width - 
            loopPlayRef.current.getBoundingClientRect().width) / numBeats
        const beatOffset = Math.round(offset / beatSize)
        const newBounds = {...chordSched[index]}
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
        console.log(newBounds, index, optype, offset, beatOffset, beatSize, orig_bounds)
        const newSched = [...chordSched]
        newSched[index] = newBounds
        setChordSched(newSched)
    }

    useEffect(() => {
        const chordPlaying = chordSched.find(
            element => beat >= element.start && beat <= element.end
        )
        if (playing &&
            chordPlaying &&
            chordPlaying.index < chords.length &&
            beat === chordPlaying.start) {
            console.log(chordPlaying)
            player.playChord(
                chordToFrequencies(chords[chordPlaying.index]),
                60.0 / bpm * (chordPlaying.end - chordPlaying.start + 1)
            )
        }
    }, [beat, player, bpm, chords, playing, chordSched])

    useEffect(() => {
        if (playing) {
            interval.current = setInterval(
                () => setBeat(prev => (prev + 1) % numBeats),
                60.00 / bpm * 1000
            )

        } else {
            clearInterval(interval.current)
        }
        return () => clearInterval(interval.current)
    }, [bpm, numBeats, playing])

    const play = () => {
        if (!playing) {
            setPlaying(true)
        } else {
            setPlaying(false)
        }
    }

    const grid_lines = []
    for (let index = 0; index < numBeats; index++) {
        const isCurrent = beat === (index) % numBeats
        grid_lines.push(
            <div className={isCurrent ? 'loop-grid-lines beatplaying' : 'loop-grid-lines'}
                style={{ gridColumn: index + 1, gridRow: 1 }} 
                key={(index + 1) * 15}
                onClick={() => setBeat(index)} />
        )
    }

    return (
        <div className='loop' ref={loopRef}>
            <div className="loop-play" ref={loopPlayRef}>
                <div>
                    <label>beats:</label>
                    <input type="number" value={numBeats} onChange={e => setNumBeats(Number(e.target.value))} />
                </div>
                <div>
                    <label>bpm:</label>
                    <input type="number" value={bpm} onChange={e => setBpm(Number(e.target.value))} />
                </div>
                <FontAwesomeIcon onClick={play} icon={playing ? faPause : faPlay} color="steelblue" size="2x" />
            </div>
            {grid_lines}
            {chordSched.filter(chord => chord.index < chords.length).map((chord, index) =>
                <ChordLoopBox 
                    chord={chords[chord.index]}
                    index={index}
                    key={chord.id} 
                    start={chord.start} 
                    end={chord.end}
                    updateSched = {updateSchedule}
                />)}
        </div>
    )
}

export default Loop