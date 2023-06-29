import { Opponent, useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { Card } from "./Cards";
import { AnimationProps, motion } from "framer-motion";
import conveyorBelt from "../assets/conveyor_belt.png";
import { UserImage } from "./User";
import DoubleArrowLeftIcon from "../icons/DoubleArrowLeftIcon";
import { Player } from "../game/Player";

const PlayerIndicator = ({ id, player}: { id: string, player: Player | Opponent }) => {
	return (
		<motion.div 
			id={id} 
			animate={{ opacity: [1, 0.2] }} 
			transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
		>
			<DoubleArrowLeftIcon width={70} height={70} />
			<UserImage user={player} />
		</motion.div>
	);
}

const ConveyorBeltImage = ({ animate }: { animate: AnimationProps["animate"] }) => {
	return (
		<motion.img 
			className="background-image"
			src={conveyorBelt}
			animate={animate}
			transition={{
				duration: 5,
				ease: "linear",
				times: [0, 1, 1],
				repeat: Infinity
			}}
		/>
	);
}

const ConveyorBeltContainer = ({ hand, keptCard }: { hand: GameCard[], keptCard: boolean }) => {
	const { socketRef, game, user } = useSushiGo();

	const player = game.players.find(p => p.id === user.id);
	if (!player) {
		return null;
	}

	const playerIdx = game.players.indexOf(player);
	const passingToPlayer = game.players[playerIdx + 1 >= game.players.length ? 0 : playerIdx + 1];
	const receivingFromPlayer = game.players[playerIdx - 1 < 0 ? game.players.length - 1 : playerIdx - 1];

	return (
		<div className="conveyor-belt-container">
			<ConveyorBeltImage animate={{ x: ["0%", "-100%", "100%"] }} />
			<ConveyorBeltImage animate={{ x: ["100%", "0%", "100%"] }} />

			<div className="player-hand-container">
				<PlayerIndicator id='pass-to' player={passingToPlayer} />
				
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

				<PlayerIndicator id='receive-from' player={receivingFromPlayer} />
			</div>
		</div>
	);
}

export default ConveyorBeltContainer;