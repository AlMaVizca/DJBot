
import React from 'react';

import filter from '../filter';

const stateArray       = ['loading', 'focus', 'error'];
const defaultClassName = 'ui input';
const componentName    = 'Input';

const Basic = React.createClass({

  render: function () {

    const { props: { children, placeholder, type, ...other } } = this;

    if (typeof children != 'undefined') {
      return (
        <div {...other} >
          {children}
        </div>
      );
    } else {
      return (
        <div {...other}>
          <input
            placeholder={placeholder}
            type={type}/>
        </div>
      )
    }
  }
});

const Input = new filter(Basic)
  .stateFilter(stateArray)
  .classGenerator(defaultClassName)
  .getComposeComponent(componentName);

export default Input;
