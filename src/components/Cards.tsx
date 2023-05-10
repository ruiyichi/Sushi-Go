import { useState } from "react";
import { CARD_IMAGES } from "../game/Images";
import { motion, Variants } from "framer-motion";
import { v4 as uuid } from "uuid";

export const Card = ({ cardName, onClick=() => {}, defaultStyle={} }: { cardName: string, onClick?: Function, defaultStyle?: Record<string, any> }) => {
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
				{cardName}
			</div>
			<img 
				style={{ visibility: loaded ? 'inherit' : 'hidden' }}
				src={CARD_IMAGES[cardName]}
				onLoad={() => setLoaded(true)}
				width={100} 
				height={150}
				draggable={false}
			/>
		</motion.div>
	);
}