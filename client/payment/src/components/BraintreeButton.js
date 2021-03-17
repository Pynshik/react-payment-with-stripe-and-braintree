import React from "react";
import DropinForBraintree from "./DropinForBraintree";

export class BraintreeButton extends React.Component {
  instance;

  state = {
    clientToken: null,
    visibleDropIn: false,
  };

  handleClick = this.handleClick.bind(this);

  async componentDidMount() {
    let self = this;
    try {
      async function getToken() {
        const response = await fetch("/braintree_client_token");
        const allResponse = await response.json();
        const clientToken = allResponse.clientToken;

        self.setState({ clientToken });
      }
      getToken();
    } catch (error) {
      console.log(error);
    }
  }

  async handleClick() {
    this.setState({ visibleDropIn: !this.state.visibleDropIn });
  }

  render() {
    if (!this.state.clientToken) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div>
          {this.state.visibleDropIn && (
            <DropinForBraintree
              amount={this.props.amount}
              quantity={this.props.quantity}
              history={this.props.history}
            />
          )}
          <button className="bigButton" onClick={this.handleClick}>
            Buy through Braintree for {this.props.price}
          </button>
        </div>
      );
    }
  }
}
