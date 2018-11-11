import React from "react";
import Card from "./cards/Card";
import PropTypes from 'prop-types';

export default function Pile(props) {
  if (!props.cardOnTop) return null;
  return (
    <div id="pile">
      <Card card={props.cardOnTop} />{" "}
    </div>
  );
}

Pile.propTypes = { 
  cardOnTop: PropTypes.object
 };