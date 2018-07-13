import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/css/Tweet.css';

const Tweet = props => {
	const screenName = `@${props.screenName}`;

	return (
		<div className="card">
			<div className="card-body">
				<div className="card-top">
					<img src={props.picture} className="rounded-circle profile-pic" />
					<div className="user-details">
						<Link to={`/tweets/${props.screenName}`}>
							<h5 className="card-title">{screenName}</h5>
						</Link>
						<h6 className="card-subtitle mb-2 text-muted">{props.userName}</h6>
					</div>
				</div>

				<p className="card-text"> {props.text} </p>
			</div>
		</div>
	);
};

export default Tweet;
