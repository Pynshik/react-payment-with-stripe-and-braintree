import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './index.css';
import { Checkout } from './components/Checkout';
import { Canceled } from './components/Canceled';
import { Success } from './components/Success';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
          <Route path="/cancel">
            <Canceled />
          </Route>
          <Route path="/success">
            <Success />
          </Route>
          <Route path="/">
            <Checkout />
          </Route>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
