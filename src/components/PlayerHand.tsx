import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { Card } from "./Cards";
import { motion } from "framer-motion";
import conveyorBelt from "../assets/conveyor_belt.png";

const PlayerHand = ({ hand, keptCard }: { hand: GameCard[], keptCard: boolean }) => {
	const { socketRef, game } = useSushiGo();

	return (
		<div 
			className="player-hand-container" 
		>
			<motion.img 
				className="background-image"
				src={conveyorBelt}
				animate={{ x: ["0%", "-100%", "100%"] }}
				transition={{
					duration: 5,
					ease: "linear",
					times: [0, 1, 1],
					repeat: Infinity
				}}
			/>
			<motion.img 
				className="background-image"
				src={conveyorBelt}
				animate={{ x: ["100%", "0%", "100%"] }}
				transition={{
					duration: 5,
					ease: "linear",
					times: [0, 1, 1],
					repeat: Infinity
				}}
			/>
			
			<motion.div
				className="player-hand"
				key={game.turn}
				initial={{ x: "100%" }}
				animate={{
					x: ['0%', '-100%', '100%', '0%'],
					transition: {
						duration: 1,
						times: [0, 0.25, 0.25, 1],
					},
				}}
			>
				{hand.map((card, idx) => {
					return (
						<Card
							variant="playable"
							key={idx}
							cardName={card.name}
							onClick={() => socketRef.current?.emit(keptCard ? 'keepSecondCard' : 'keepCard', card, idx)}
						/>
					);
				})}
			</motion.div>
		</div>
	);
}

export default PlayerHand;