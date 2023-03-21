import { useState } from "react";
import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { CARD_IMAGES } from "../game/Images";
import { motion, Variants } from "framer-motion";

export const Card = ({ card, onClick=() => {}, defaultStyle={}, }: { card: GameCard, onClick?: Function, defaultStyle?: { [key: string]: any } }) => {
	const [loaded, setLoaded] = useState(false);
	
	const variants: Variants = {
		default: defaultStyle,
		hover: {
			scale: 1.1,
			transition: { duration: 0.3 },
		}
	};

	return (
		<motion.div
			className="card"
			initial="default"
			whileHover="hover"
			variants={variants}
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
		</motion.div>
	);
}

export const HandCard = ({ card, idx, numCards }: { card: GameCard, idx: number, numCards: number }) => {
	const { socket } = useSushiGo();

	const factor = 0.15 * numCards;
	let x = (idx - Math.floor(0.5 * numCards)) * 0.05;
	if (numCards % 2 === 0) {
		x += 0.025;
	}
	const angle = x * (Math.PI / factor);

	const fanWidth = numCards * 50;
  const fanHeight = fanWidth * 1.5;

	return (
		<Card
			card={card}
			onClick={() => socket.emit('keepCard', card, idx)}
			defaultStyle={{
				rotate: `${angle}rad`,
				x: fanWidth * Math.sin(angle),
				y: fanHeight * (1 - Math.cos(angle)),
				zIndex: idx
			}}
		/>
	);
}

export const PlayedCard = ({ card }: { card: GameCard }) => {
	return (
		<Card
			card={card}
			defaultStyle={{ position: 'relative' }}
		/>
	);
}