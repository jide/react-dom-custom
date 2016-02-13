import React, { Component, PropTypes } from 'react';
import ReactDOM from '../src';

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      counter: 0
    };
  }

  handleClick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
    	<div onClick={ this.handleClick.bind(this) }>
    		{ this.state.counter }
    	</div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
