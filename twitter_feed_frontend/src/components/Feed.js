import React, { Component } from 'react';
import Websocket from 'react-websocket';
import Tweet from './Tweet';
import Alert from './Alert';
import '../styles/css/Feed.css';

class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tweets: [],
			incoming: [],
			filtered: []
		};
	}

	componentDidMount() {
		const user = this.props.match.params.user;
		fetch(`http://localhost:8000/api/twitter/tweets?user=${user}`)
			.then(result => {
				return result.json();
			})
			.then(data => {
				const tweets = data.tweets;
				this.setState({ tweets, filtered: tweets });
			});
	}

	closeAlert = () => {
		this.setState(prev => {
			const tweets = [...prev.incoming, ...prev.tweets];
			return { tweets, filtered: tweets, incoming: [] };
		});
	};

	createTweets = () => {
		return this.state.filtered.map((tweet, i) => {
			return (
				<Tweet
					text={tweet.text}
					userName={tweet.user.name}
					screenName={tweet.user.screen_name}
					picture={tweet.user.profile_image_url_https}
					key={i}
				/>
			);
		});
	};

	handleOpen = () => {
		const connect = {
			room: this.props.match.params.user,
			command: 'join'
		};
		this.sendSocketMessage(connect);
	};

	receiveData = data => {
		const json = JSON.parse(data);
		this.setState(prev => {
			const newTweets = JSON.parse(json.message);
			console.log(newTweets);
			return { incoming: [newTweets, ...prev.incoming] };
		});
	};

	search = e => {
		const query = e.target.value.toLowerCase();
		const filtered = this.state.tweets.filter(ele => {
			return ele.text.toLowerCase().indexOf(query) !== -1;
		});

		this.closeAlert();
		this.setState({ filtered });
	};

	sendSocketMessage = message => {
		const socket = this.refs.socket;
		socket.state.ws.send(JSON.stringify(message));
	};

	render() {
		const socket = `ws://localhost:8000/feed/twitter-stream/`;
		const tweets = this.createTweets();
		const incomingLen = this.state.incoming.length;
		console.log(this.state.incoming);
		return (
			<React.Fragment>
				<div className="feed-container">
					<Alert
						show={incomingLen > 0}
						text={`See ${incomingLen} new Tweet(s)`}
						close={this.closeAlert}
					/>
					<div className="form-group">
						<input
							type="text"
							placeholder="Filter tweets"
							onChange={this.search}
							className="form-control search"
						/>
					</div>
					{tweets}
				</div>
				<Websocket
					url={socket}
					ref="socket"
					onMessage={this.receiveData}
					onOpen={this.handleOpen}
					reconnect={true}
				/>
			</React.Fragment>
		);
	}
}

export default Feed;
