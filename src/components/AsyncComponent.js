import React, {Component} from 'react';

export default function asyncComponent (importComponent) {
  class AsyncComponent extends Component {
    constructor (props) {
      super(props);
      // eslint-disable-next-line react/state-in-constructor
      this.state = {component: null};
    }

    async componentDidMount () {
      const {default: component} = await importComponent();

      this.setState({
        component
      });
    }

    render () {
      const C = this.state.component;

      return C ? <C {...this.props}/> : null;
    }
  }

  return AsyncComponent;
}
