import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/css/Home.css';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: ''
		};
	}

	handleChange = e => {
		this.setState({ query: e.target.value });
	};

	render() {
		const url = `/tweets/${this.state.query}`;
		return (
			<div className="home-container">
				<div className="input-group search">
					<input
						type="text"
						placeholder="Search for a Twitter user"
						value={this.state.query}
						onChange={this.handleChange}
						className="form-control search"
					/>
					<div className="input-group-append">
						<Link to={url}>
							<button className="btn btn-outline-primary"> Search </button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
