import React, { Component } from 'react';
import './App.css';
import GameLogic from './containers/GameLogic';
import './style/style.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Aux from './hoc/Auxilliary';
class App extends Component {
  render() {
    return (
      <Aux>
        <GameLogic />
      </Aux>
    );
  }
}

export default App;
