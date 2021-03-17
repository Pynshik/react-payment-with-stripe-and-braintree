import React from 'react';
import {Link} from 'react-router-dom';

export function Success() {
    return (
      <div>
        <h1>Your payment succeded!</h1>
        <Link to="/">Restart demo</Link>
      </div>
    );
  }
  