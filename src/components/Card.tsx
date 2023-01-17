import { useState } from "react";

const Card = ({ src, idx, numCards }: { src: string, idx: number, numCards: number }) => {
	let maxAngleOffset = 45;
	let rotationAngle = (idx / (numCards - 1)) * 2 * maxAngleOffset - maxAngleOffset;

	let minTopOffset = -25;
	let topOffset = -minTopOffset * Math.abs((numCards - 1) * 0.5 - idx);

	const defaultStyle = {
		zIndex: idx,
		transform: `rotate(${rotationAngle}deg)`,
		top: `${topOffset}px`
	};

	const [style, setStyle] = useState({ ...defaultStyle });

	return (
		<div
			className="card"
			style={style}
			onMouseEnter={() => {
				setStyle({ ...defaultStyle, transform: defaultStyle.transform + ' translateY(-50px)' });
			}}
			onMouseLeave={() => {
				setStyle({ ...defaultStyle })
			}}
			onClick={() => {
				
			}}
		>
			<img 
				src={src} 
				width={100} 
				height={150} 
			/>
		</div>
	);
}

export default Card;