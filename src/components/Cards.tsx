import { useState } from "react";
import { Card as GameCard } from "../game/Cards";
import { CARD_IMAGES } from "../game/Images";
import { motion, Variants } from "framer-motion";
import { v4 as uuid } from "uuid";

export const Card = ({ card, onClick=() => {}, defaultStyle={}, }: { card: GameCard, onClick?: Function, defaultStyle?: Record<string, any> }) => {
	const [loaded, setLoaded] = useState(false);
	
	const variants: Variants = {
		default: defaultStyle,
		hover: {
			scale: 1.2,
			transition: { duration: 0.3 },
		}
	};

	return (
		<motion.div
			key={uuid()}
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
				draggable={false}
			/>
		</motion.div>
	);
}