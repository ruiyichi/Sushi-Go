import { useState } from "react";
import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { CARD_IMAGES } from "../game/Images";

export const Card = ({ card, onClick=() => {}, defaultStyle={}, onHoverStyle={} }: { card: GameCard, onClick?: Function, defaultStyle?: Object, onHoverStyle?: Object }) => {
	const [loaded, setLoaded] = useState(false);
	const [style, setStyle] = useState(defaultStyle);

	return (
		<div
			className="card"
			style={style}
			onMouseEnter={() => setStyle(onHoverStyle)}
			onMouseLeave={() => setStyle(defaultStyle)}
			onClick={() => onClick()}
		>
			<div className="card-info">
				{card.name}
			</div>
			<img 
				style={{ visibility: loaded ? 'inherit' : 'hidden' }}
				src={CARD_IMAGES[card.name]}
				onLoad={() => setLoaded(true)}
				width={100} 
				height={150}
			/>
		</div>
	);
}

export const HandCard = ({ card, idx, numCards }: { card: GameCard, idx: number, numCards: number }) => {
	const { socket } = useSushiGo();

	let maxAngleOffset = 45;
	let rotationAngle = (idx / (numCards - 1)) * 2 * maxAngleOffset - maxAngleOffset;

	let minTopOffset = -25;
	let topOffset = -minTopOffset * Math.abs((numCards - 1) * 0.5 - idx);

	const defaultStyle = {
		zIndex: idx,
		transform: `rotate(${rotationAngle}deg)`,
		top: `${topOffset}px`,
		marginLeft: '-75px'
	};

	return (
		<Card
			card={card}
			onClick={() => socket.emit('keepCard', card, idx)}
			defaultStyle={defaultStyle}
			onHoverStyle={{ ...defaultStyle, transform: `${defaultStyle.transform} translateY(-50px) scale(1.1)` }}
		/>
	);
}

export const PlayedCard = ({ card }: { card: GameCard }) => {
	const onHoverStyle = {
		transform: 'scale(1.1)'
	};

	return (
		<Card
			card={card}
			onHoverStyle={onHoverStyle}
		/>
	);
}