import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Alert from '../components/Alert'

configure({ adapter: new Adapter() });

describe('Alert', () => {
	let props;
	let mountedAlert = false;

	const Alert = () => {
		if (!mountedAlert) {
			mountedAlert = mount(<Alert {...props} />);
		}
		return mountedAlert;
	};

	beforeEach(() => {
		props = {
      show: false,
      text: '',
      close: () => false
		};
		mountedAlert = undefined;
	});

	it('returns null when show is false', () => {
		props.show = false;
		const alert = Alert();
		expect(alert).toBe(null);
	});
});
