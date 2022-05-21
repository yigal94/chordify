import React from 'react'
import { useRef } from 'react'
import { typeStr, sevStr } from '../Theory'

function ChordLoopBox({ chord, index, start, end, updateSched }) {
  const interactionType = useRef(null)
  const origClickX = useRef(null)
  const origBounds = useRef({start:0, end:0})
  

  const mouseMoveCallback = e => {
    e.preventDefault()
    const offset = e.clientX - origClickX.current
    console.log(offset)
    updateSched(index, interactionType.current, offset, origBounds.current)
  }

  const mouseUpCallback = () => {
    console.log("up")
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

  return (
    <div className='chordloopbox' style={{gridColumnStart:start+1, gridColumnEnd:end+2, gridRow:1}}>
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
  )
}

export default ChordLoopBox