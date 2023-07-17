import { useEffect, useState } from "react"

const Delayed = ({ children, delay=0, duration }: { children: JSX.Element, delay?: number, duration?: number }) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		let durationTimer: NodeJS.Timer;

		const delayTimer = setTimeout(() => {
			setShow(true);

			if (duration) {
				durationTimer = setTimeout(() => {
					setShow(false);
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