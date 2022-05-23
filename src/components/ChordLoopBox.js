import React from 'react'
import { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { typeStr, sevStr } from '../Theory'

function ChordLoopBox({ chord, index, start, end, updateSched, removeChord }) {
  const interactionType = useRef(null)
  const origClickX = useRef(null)
  const origBounds = useRef({start:0, end:0})
  
  // const [{ isDragging }, drag, ] = useDrag(() => ({
  //   type: "CHORD",
  //   item: { chord, index, start, end },
  //   collect: monitor => ({ isDragging: !!monitor.isDragging() })
  // }))

  const mouseMoveCallback = e => {
    e.preventDefault()
    const offset = e.clientX - origClickX.current
    updateSched(index, interactionType.current, offset, origBounds.current)
  }

  const mouseUpCallback = () => {
    interactionType.current = null
    window.removeEventListener('mouseup', mouseUpCallback)
    window.removeEventListener('mousemove', mouseMoveCallback)
  }

  const resizeMouseDown = direction => e => {
    origBounds.current = {start:start, end:end}
    origClickX.current = e.clientX
    if(direction === "right") {
      interactionType.current = "resizeRight"
      console.log("right")
    } else if (direction === "left") {
      interactionType.current = "resizeLeft"
      console.log("left")
    }

    window.addEventListener('mousemove', mouseMoveCallback)
    window.addEventListener('mouseup', mouseUpCallback)

    e.preventDefault()
  }

  const del = e => {
    console.log("what")
    removeChord(index)
    e.stopPropagation()
  }

  return (
    <div className='loopchordcontainer' style={{gridColumnStart:start+1, gridColumnEnd:end+2, gridRow:1}}>
      <div className="delete" onMouseDown={e => e.stopPropagation()} onClick={del}>&times;</div>
      <div className='chordloopbox' >
        <div className='loopdragleft' onMouseDown={resizeMouseDown("left")}/>
        <div className='innerloopbox'>
            <div className="boxelem loopboxroot">{chord.root}</div>
            <div className="boxelem loopboxtype">{typeStr(chord)}</div>
            <div className="boxelem loopboxseventh">{sevStr(chord)}</div>
            <div className="boxelem loopboxextensions">
                {chord.extensions.map(elem => <div className="boxext" key={elem}>{elem}</div>)}
            </div>
        </div>
        <div className='loopdragright' onMouseDown={resizeMouseDown("right")}/>
      </div>
    </div>
  )
}

export default ChordLoopBox