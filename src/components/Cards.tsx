import { useState } from "react";
import { CARD_FILES } from "../game/Images";
import { motion, Variants } from "framer-motion";

export const Card = ({ cardName, height=150, onClick, style, variant="default" }: { cardName: string, height?: number, onClick?: Function, style?: React.CSSProperties, variant?: string }) => {
	const [loaded, setLoaded] = useState(false);
	const animationVariants: Variants = {
		default: {},
		playable: { translateY: -50 }
	};

	return (
		<motion.div
			key={cardName}
			whileHover={variant}
			variants={animationVariants}
			className="card"
			onClick={() => onClick && onClick()}
			style={{ ...style, cursor: onClick === undefined ? "default" : "pointer", visibility: loaded ? 'inherit' : 'hidden' }}
		>
			<div className="card-info">
				{cardName}
			</div>
			<img 
				src={CARD_FILES[cardName].image}
				onLoad={() => setLoaded(true)}
				height={height}
				draggable={false}
				alt={cardName}
			/>
		</motion.div>
	);
}

export const CardIcon = ({ cardName, height=50, style }: { cardName: string, height?: number, style?: React.CSSProperties }) => {
	const [loaded, setLoaded] = useState(false);
	
	return (
		<div className='card-icon' style={style}>
			<img 
				style={{ visibility: loaded ? 'inherit' : 'hidden' }}
				src={CARD_FILES[cardName].icon} 
				height={height}
				onLoad={() => setLoaded(true)}
				draggable={false}
				alt={cardName}
			/>
		</div>
	);
}