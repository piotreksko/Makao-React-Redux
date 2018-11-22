import React from 'react';
import ReactDOM from 'react-dom';
import { GameLogic } from './containers/GameLogic';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GameLogic />, div);
  ReactDOM.unmountComponentAtNode(div);
});
