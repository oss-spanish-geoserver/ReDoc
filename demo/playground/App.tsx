import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Redoc } from '../../src/components/Redoc/Redoc';

const App = props => <Redoc {...props}>Hello world!</Redoc>;

export default hot(module)(App);
