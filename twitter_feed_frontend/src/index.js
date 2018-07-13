import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter, Route } from 'react-router-dom';
import Feed from './components/Feed';
import Home from './components/Home';

ReactDOM.render(
	<BrowserRouter>
		<div>
			<Route exact path="/tweets/:user/" component={Feed} />
			<Route exact path="/" component={Home} />
		</div>
	</BrowserRouter>,
	document.getElementById('root')
);
