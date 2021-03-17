import React from 'react';
import {Link} from 'react-router-dom';

export function Canceled() {
    return (
      <div>
        <h1>Your payment canceled!</h1>
        <Link to="/">Try again</Link>
      </div>
    );
  }
