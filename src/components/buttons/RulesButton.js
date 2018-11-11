import React from "react";

export default function RulesButton(props) {
  return (
    <button onClick={props.onClick} id="restart-game" className="rules-icon">
      <img
        alt="restart"
        className="icon-image"
        src="https://cdn.iconscout.com/public/images/icon/premium/png-512/prescription-notes-rules-checklist-todo-tasks-39940c544bd69358-512x512.png"
      />
    </button>
  );
}
