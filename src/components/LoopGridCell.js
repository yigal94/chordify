import React from 'react'
import { useDrop } from 'react-dnd'

function LoopGridCell({ isCurrent, index, onClick, addChord }) {
  const [, drop] = useDrop(() => ({
      accept: "NEWCHORD",
      drop: (item, monitor) => {
        addChord(index, item.chord)
      },
  }), [addChord])
  return (
    <div ref={drop} className={isCurrent ? 'loop-grid-lines beatplaying' : 'loop-grid-lines'}
                style={{ gridColumn: index + 1, gridRow: 1 }} 
                key={(index + 1) * 15}
                onClick={onClick} />
  )
}

export default LoopGridCell