import React from 'react';
import '../styles/css/Alert.css';

const Alert = props => {
	if (!props.show) {
		return null;
	}

	return (
		<div onClick={props.close} className="alert alert-light">
			{props.text}
		</div>
	);
};

export default Alert;
