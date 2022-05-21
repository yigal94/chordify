import React, { useState } from 'react'
import { chordToFrequencies } from '../Theory'
import { faFloppyDisk, faPlus, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from 'lodash';

const ChordBuilder = ({ player, addChord, editedChord, saveChord }) => {
  const [root, setRoot] = useState("C")
  const [chordType, setChordType] = useState("Major")
  const [sev, set7th] = useState("None")
  const [exts, setExtensions] = useState([])
  const [id, setId] = useState(0)
  const [firstEdit, setFirstEdit] = useState(true)

  const isEditing = editedChord != null
  const my_id = isEditing ? editedChord.id : id

  const chord = {
    root: root,
    type: chordType,
    seventh: sev,
    extensions: exts,
    id: id
  }

  if(isEditing && firstEdit) {
    setRoot(editedChord.root)
    setChordType(editedChord.type)
    set7th(editedChord.seventh)
    setExtensions(editedChord.extensions)
    setFirstEdit(false)
  }

  const myAddChord = () => {
    if(isEditing) {
      chord.id = my_id
      saveChord(chord)
      setFirstEdit(true)
      console.log(chord)
      return
    }
    addChord(chord)
    setId(id + 1)
  }

  const NoteButton = ({ note }) => { return <button className={"note " + (note === root ? "chosen" : "")} onClick={e => setRoot(e.target.id)} id={note}>{note}</button> }
  
  const ChordTypeButton = ({ type }) => { 
    return <button className={"chordtype " + (type === chordType ? "chosen" : "")} onClick={e => setChordType(e.target.id)} id={type}>{type}</button> 
  }

  const Chord7thButton = ({ type }) => { 
    return <button className={"chordtype " + (type === sev ? "chosen" : "")} onClick={e => set7th(e.target.id)} id={type}>{type}</button> 
  }

  const ChordExtensionsButton = ({ type }) => {
    const extOnClick = e => {
      if (exts.includes(e.target.id)) {
        setExtensions(exts.filter(item => item !== e.target.id))
      } else {
        if (exts.length < 3) {
          setExtensions(ex => [...ex, e.target.id])
        }
      }
    }
    return <button className={"note " + (exts.includes(type) ? "chosen" : "")} onClick={extOnClick} id={type}>{type}</button> 
  }



  return (
    <div className='sound'>
      <h2>Build a Chord</h2>
      <div className="buildgrid">
        <div className='build-root'>
          <h3>Root</h3>
          <NoteButton note="C" />
          <NoteButton note="C♯" />
          <NoteButton note="D♭" />
          <NoteButton note="D" />
          <NoteButton note="D♯" />
          <NoteButton note="E♭" />
          <NoteButton note="E" />
          <NoteButton note="F" />
          <NoteButton note="F♯" />
          <NoteButton note="G♭" />
          <NoteButton note="G" />
          <NoteButton note="G♯" />
          <NoteButton note="A♭" />
          <NoteButton note="A" />
          <NoteButton note="A♯" />
          <NoteButton note="B♭" />
          <NoteButton note="B" />
        </div>
        <div className='build-type'>
          <h3>Type</h3>
          <ChordTypeButton type="Major" />
          <ChordTypeButton type="Minor" />
          <ChordTypeButton type="Diminished" />
          <ChordTypeButton type="Augmented" />
          <ChordTypeButton type="Sus4" />
          <ChordTypeButton type="Sus2" />
        </div>
        <div className='build-seventh'>
          <h3>7th</h3>
          <Chord7thButton type="None" />
          <Chord7thButton type="7" />
          <Chord7thButton type="Dim7/6" />
          <Chord7thButton type="Maj7" />
        </div>
        <div className='build-extensions'>
          <h3>Extensions</h3>
          <ChordExtensionsButton type="♭9" />
          <ChordExtensionsButton type="9" />
          <ChordExtensionsButton type="♯9" />
          <ChordExtensionsButton type="11" />
          <ChordExtensionsButton type="♯11" />
          <ChordExtensionsButton type="♭13" />
          <ChordExtensionsButton type="13" />
        </div>
          <button className="chordplay" onClick={() => player.playChord(chordToFrequencies(chord), 2)}>
            <FontAwesomeIcon icon={faVolumeHigh} color="steelblue" size="2x" />
          </button>
          <button className={isEditing ? "chordedit" : "chordsubmit"} onClick={() => myAddChord(chord)}>
            <FontAwesomeIcon 
              icon={isEditing ? faFloppyDisk : faPlus} 
              color={isEditing ? "white" : "steelblue"} 
              size="2x" />
          </button>
        </div>
    </div>
  )
}

export default ChordBuilder