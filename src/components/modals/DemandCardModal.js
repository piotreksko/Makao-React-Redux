import React from "react";

export default function DemandCardModal(props) {
  return (
    <div>
      <span>Demand card</span>
      <div className="demand-icons">
        <button onClick={e => props.demandCard('5')} className="suit-icon">
          5
        </button>
        <button onClick={e => props.demandCard('6')} className="suit-icon">
          6
        </button>
        <button onClick={e => props.demandCard('7')} className="suit-icon">
          7
        </button>
        <button onClick={e => props.demandCard('8')} className="suit-icon">
          8
        </button>
        <button onClick={e => props.demandCard('9')} className="suit-icon">
          9
        </button>
        <button onClick={e => props.demandCard('10')} className="suit-icon">
          10
        </button>
        <button onClick={e => props.demandCard('queen')} className="suit-icon">
          Q
        </button>
        <button onClick={e => props.demandCard('')} className="suit-icon">
          X
        </button>
      </div>
    </div>
  );
}
