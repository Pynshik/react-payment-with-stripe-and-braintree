import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import braintree from 'braintree-web-drop-in-react'
import {useHistory} from 'react-router-dom';
import {BraintreeButton} from './BraintreeButton';

const stripePromise = loadStripe('pk_test_51ITSy5J44jiWqwK1yvnrmvzb8LbJxikYxyklZb14MZTEf0x4U7qbA87c5p5qB4FXje7368s7LEkTOXhCAcwJMAO5000BiEo7mD');

function reducer(state, action){
  switch(action.type) {
    case 'decrement':
      return {
        ...state,
        quantity: state.quantity - 1,
        price: formatPrice({
          currency: state.currency, 
          amount: state.amount,
          quantity: state.quantity - 1
        })
      };
    case 'increment':
      return {
        ...state,
        quantity: state.quantity + 1,
        price: formatPrice({
          currency: state.currency,
          amount: state.amount,
          quantity: state.quantity + 1
        })
      };
    case 'setPrice':
      return {
        ...state,
        ...action.payload,
        price: formatPrice({
          currency: action.payload.currency, 
          amount: action.payload.amount,
          quantity: state.quantity
        })
      };
    case 'setLoading': 
      return {
        ...state, loading: action.payload.loading
      };
    case 'setError': 
      return {
        ...state, error: action.payload.error
      };
    default:
      throw Error;
  }
};

const formatPrice = ({ currency, amount, quantity}) => {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  });

  const price = (amount / 100 * quantity).toFixed(2);

  return numberFormat.format(price);
};

export function Checkout() {
  const [state, dispatch] = React.useReducer(reducer, {
    quantity: 1,
    price: null,
    loading: null,
    error: null,
    stripe: null
  });

  const history = useHistory();

  React.useEffect(() => {
    try {
      async function fetchPrice() {
        const result = await fetch('/price');
        const {currency, amount} = await result.json();
  
        dispatch({ 
          type: 'setPrice',  
          payload: { currency, amount }
        });
      };
      fetchPrice();      
    } catch (error) {
        dispatch({ type: 'setError', payload: { error } });
        dispatch({ type: 'setLoading', payload: {loading: false} });
    }
  }, [])

    async function handleClick(quantity){
      try {
        dispatch({ type: 'setLoading', payload: { loading: true } });
        const stripe = await stripePromise;
        
        const response = await fetch('/create-checkout-session', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({quantity})
        });

        const session = await response.json();

        await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      } catch (error) {
        dispatch({ type: 'setError', payload: { error } });
        dispatch({ type: 'setLoading', payload: {loading: false} });
      }
    }

    return (
      <div className="root">
        <div className="main">
          <header className="header">
            <div className="sr-header__logo"></div>
            Loaf_loafer
          </header>
          <section className="container">
            <div>
              <h1>Fresh bread</h1>
              
              
              <div className="central-part">
                  <h4>Borodinsky</h4>
                  <div className="bread-image">
                    <img
                      alt="Bread"
                      src="https://images.pexels.com/photos/4203052/pexels-photo-4203052.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                      width="160"
                      height="180"
                    />
                  </div>
                  <div className="quantity-setter">
                    <button
                      className="increment-btn"
                      disabled={state.quantity === 1}
                      onClick={() => dispatch({type: 'decrement'})}
                    >
                      -
                    </button>
                      <input
                        type="number"
                        className="input-quantity"
                        id="quantity-input"
                        min="1"
                        max="10"
                        disabled
                        readOnly
                        value={state.quantity}
                      />
                    <button
                      className="increment-btn"
                      disabled={state.quantity === 10}
                      onClick={() => dispatch({type: 'increment'})}
                    >
                      +
                    </button>
                  </div>
                  <p className="sr-legal-text">Quantity (max 10)</p>
                </div>
            </div>
            <button
              role="link"
              onClick={() => handleClick(state.quantity)}
              className="bigButton"
            >
              {state.loading || !state.price
                ? 'Loading...'
                : `Buy through Stripe for ${state.price}`}
            </button>
            <BraintreeButton 
              braintree={braintree} 
              amount={state.amount} 
              quantity={state.quantity}
              price={state.price}
              history={history}
            />
            <div className='error'>{state.error?.message}</div>
          </section>
        </div>
      </div>
  );
}
