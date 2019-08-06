import React from 'react';

function asyncComponent(importComponent) {
  class AsyncComponent extends React.Component {
    render() {
      return this.state.component;
    }
    state = {
      component: null
    }
    async componentDidMount() {
      const { default: Component } = await importComponent();
      this.setState({
        component: <Component {...this.props}/>
      });
    }
  }
  return AsyncComponent;
}

export default asyncComponent;