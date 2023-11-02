import { useState } from "react";
import { CARD_ASSETS } from "../game/Images";
import { motion, Variants } from "framer-motion";
import classNames from "classnames";

export const Card = ({ cardName, onClick, style, variant="default" }: { cardName: string, onClick?: Function, style?: React.CSSProperties, variant?: "playable" | "default" }) => {
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
			className={classNames({
				card: true,
				hidden: !loaded
			})}
			onClick={() => onClick?.()}
			style={{ ...style, cursor: onClick === undefined ? "default" : "pointer" }}
		>
			<img 
				src={CARD_ASSETS[cardName].image}
				onLoad={() => setLoaded(true)}
				draggable={false}
				alt={cardName}
			/>
			<div className="card-info">
				{cardName}
			</div>
		</motion.div>
	);
}