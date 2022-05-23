import React from 'react'
import { faPen, faHand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { typeStr, sevStr } from '../Theory';
import { useDrag } from 'react-dnd';

function ChordBox({ chord, play, deleteChord, index, setEditChord, editedChord }) {

  const [, drag, preview] = useDrag(() => ({
    type: "NEWCHORD",
    item: { chord },
  }), [chord])
  
  const deleteCB = e => {
      deleteChord(chord)
      e.stopPropagation()
  }

  const setEdit = e => {
      setEditChord(index)
      e.stopPropagation()
  }

  const stopProp = e => e.stopPropagation()

  const isEditing = editedChord === index

  return (
    <div className={isEditing ? "chordbox editing" : "chordbox"} onMouseDown={() => play(chord)} ref={preview}>
        <div className="delete" onMouseDown={stopProp} onClick={deleteCB}>&times;</div>
        <div className="edit" onMouseDown={stopProp} onClick={setEdit}><FontAwesomeIcon icon={faPen} color="white" /></div>
        <div className="drag" onMouseDown={stopProp} ref={drag}><FontAwesomeIcon icon={faHand} color="white" /></div>
        <div className="boxelem boxroot">{chord.root}</div>
        <div className="boxelem boxtype">{typeStr(chord)}</div>
        <div className="boxelem boxseventh">{sevStr(chord)}</div>
        <div className="boxelem boxextensions">
            {chord.extensions.map(elem => <div className="boxext" key={elem}>{elem}</div>)}
        </div>
    </div>
  )
}

export default ChordBox