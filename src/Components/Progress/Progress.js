import React from 'react'

const Progress = ({isAnimating}) => {
  if (isAnimating) {
    return (
      <div className="progress progress__indeterminate is-upgraded">
        <div className="progressbar bar bar1" style={{width: "0%"}}></div>
        <div className="bufferbar bar bar2" style={{width: "100%"}}></div>
      </div>
    )
  }

  return null;
}

export default Progress;