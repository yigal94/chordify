import React, { useEffect, useRef, useState } from 'react'
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { chordToFrequencies } from '../Theory';

function LoopControls({ chordSched, numBeats, setNumBeats, beat, setBeat, player }) {
    const [playing, setPlaying] = useState(false)
    const [bpm, setBpm] = useState(100)
    const interval = useRef(null)

    const play = () => {
        if (!playing) {
            setPlaying(true)
        } else {
            setPlaying(false)
        }
    }

    useEffect(() => {
        const chordPlaying = chordSched.find(
            element => beat >= element.start && beat <= element.end
        )
        if (playing &&
            chordPlaying &&
            beat === chordPlaying.start) {
            console.log(chordPlaying)
            player.playChord(
                chordToFrequencies(chordPlaying.chord),
                60.0 / bpm * (chordPlaying.end - chordPlaying.start + 1)
            )
        }
    }, [beat, player, bpm, playing, chordSched])

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
    }, [bpm, numBeats, playing, setBeat])

    return (
        <div className="loop-play">
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
    )
}

export default LoopControls