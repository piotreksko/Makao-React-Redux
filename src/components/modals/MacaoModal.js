import React from 'react'

export default function MacaoModal(props) {
  return (
    <div
      className={`center suit-popup flex-container ${
        props.show ? "modal-shown" : "modal-hidden"
      }`}
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      <h4 style={{ color: "white", margin: 10, padding: 10 }}>
        {props.playerMacao ? "You: Macao!" : null} <br/>
        {props.cpuPlayerMacao ? "Computer: Macao!" : null}
      </h4>
    </div>
  )
}
