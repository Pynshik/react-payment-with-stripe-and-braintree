import React from "react";
import DropIn from "braintree-web-drop-in-react";
 
class DropinForBraintree extends React.Component {
    instance;
    
    state = {
        clientToken: null,
        isVisibleDropin: false
    };
    
    async componentDidMount() {
            const response = await fetch('/braintree_client_token');
            const allResponse = await response.json();
            const clientToken = allResponse.clientToken;
    
        this.setState({
        clientToken,
        });
    }
    
    async buy() {
        const amount = this.props.amount / 100 * this.props.quantity;
        const { nonce } = await this.instance.requestPaymentMethod();

        const response = await fetch('/braintree_purchase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nonce, amount})
        });

        const info = await response.json();
        if(info.success) {
            return this.props.history.push("/success");
        } else {
            return this.props.history.push("/cancel");
        }
    };
 
  render() {
    if (!this.state.clientToken) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div className="dropin-form">
            <DropIn
            options={{ authorization: this.state.clientToken }}
            onInstance={(instance) => (this.instance = instance)}
            />
          <button onClick={this.buy.bind(this)}>
            Buy
          </button>
        </div>
      );
    }
  }
}

export default DropinForBraintree;