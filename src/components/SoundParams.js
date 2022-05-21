import React, { useState } from 'react'
import NotePlayer from '../Sounds'
import _ from 'lodash'
import Icon from '@mdi/react';
import { mdiSineWave, mdiSquareWave, mdiTriangleWave, mdiSawtoothWave } from "@mdi/js";

const SoundParams = ({ actx, out, setSound, sound }) => {
  const [type, setType] = useState("sine")

  const changeType = e => {
    setType(e.currentTarget.id)
  }
  
  const [env, setEnv] = useState({
    attack: 0.02,
    decay: 1,
    sustain: 0.3,
    release: 0.3
  })
  const [vibrato, setVibrato] = useState({
    gain: 5,
    frequency: 4
  })

  const changeVibratoParam = e => {
    const vib = {...vibrato}
    vib[e.target.id] = Number(e.target.value)
    setVibrato(vib)
  }

  const changeEnvParam = e => {
    const envelope = {...env}
    envelope[e.target.id] = Number(e.target.value)
    setEnv(envelope)
  }

  const changeLogEnvParam = e => {
    const envelope = {...env}
    envelope[e.target.id] = 2**Number(e.target.value)
    setEnv(envelope)
  }

  const nameToIcon = {
    "sine" : mdiSineWave,
    "triangle" : mdiTriangleWave,
    "sawtooth" : mdiSawtoothWave,
    "square" : mdiSquareWave
  }

  const Button = ({ mytype }) => 
    <button className={type===mytype ? "chosen chordtype" : "chordtype"} id={mytype} onClick={changeType}>
      <Icon path={nameToIcon[mytype]} size={1} />
    </button>
  
  const my_sound = {type: type, envelope: env, vibrato: vibrato}
  
  const tryIt = () => {
    new NotePlayer(actx, out, my_sound).playNote(32.70320*8, 2)
  }

  const is_submit_disabled = () => _.isEqual(my_sound, sound)

  return (
    <div className="sound" >
        <h2>Sound Parameters</h2>
        <h3>Type</h3>
        <div className='buttonrow'>
          <Button mytype="sine" />
          <Button mytype="sawtooth" />
          <Button mytype="triangle" />
          <Button mytype="square" />
        </div>
        <h3>Vibrato params</h3>
          <div className='labeledslider'>
            <label>Gain</label>
            <input type="range" className='slider' id="gain" onChange={changeVibratoParam} defaultValue={vibrato.gain} min="0" max="20" step="0.5"/>
          </div>
          <div className='labeledslider'>
            <label>Frequency</label>
            <input type="range" className='slider' id="frequency" onChange={changeVibratoParam} defaultValue={vibrato.frequency} min="0" max="10" step="0.1" />
          </div>
        <h3>Envelope</h3>
          <div className='labeledslider'>
            <label>Attack</label>
            <input type="range" className='slider' id="attack" onChange={changeLogEnvParam} defaultValue={Math.log2(env.attack)} min="-10" max="0" step="0.001"/>
          </div>
          <div className='labeledslider'>
            <label>Decay</label>
            <input type="range" className='slider' id="decay" onChange={changeEnvParam} defaultValue={env.decay} min="0" max="1" step="0.001"/>
          </div>
          <div className='labeledslider'>
            <label>Sustain</label>
            <input type="range" className='slider' id="sustain" onChange={changeEnvParam} defaultValue={env.sustain} min="0" max="1" step="0.001" />
          </div>
          <div className='labeledslider'>
            <label>Release</label>
            <input type="range" className='slider' id="release" onChange={changeEnvParam} defaultValue={env.release} min="0" max="1" step="0.001" />
          </div>
        <div>
          <button onClick={tryIt} className="regular">Try it!</button>
          <button disabled={is_submit_disabled()} onClick={() => setSound(my_sound)} className="regular submit">Submit!</button>
        </div>
        
    </div>
  )
}

export default SoundParams