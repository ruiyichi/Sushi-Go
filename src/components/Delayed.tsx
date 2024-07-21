import { FC, useEffect, useState } from "react"

interface DelayedProps {
	children: JSX.Element, 
	delay?: number, 
	duration?: number, 
	onExit?: Function
}
const Delayed: FC<DelayedProps> = ({ children, delay=0, duration, onExit }) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		let durationTimer: NodeJS.Timer;

		const delayTimer = setTimeout(() => {
			setShow(true);

			if (duration) {
				durationTimer = setTimeout(() => {
					setShow(false);
					onExit?.();
				}, duration * 1000);
			}
		}, delay * 1000);

		return () => {
			clearTimeout(delayTimer);
			clearTimeout(durationTimer);
		}

	}, [delay, duration]);

	return show ? children : null;
}

export default Delayed;