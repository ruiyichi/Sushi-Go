import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { Card } from "./Cards";
import { motion } from "framer-motion";
import conveyorBelt from "../assets/conveyor_belt.png";
import { UserImage } from "./UserInfo";
import DoubleArrowLeftIcon from "../icons/DoubleArrowLeftIcon";

const PlayerHand = ({ hand, keptCard }: { hand: GameCard[], keptCard: boolean }) => {
	const { socketRef, game, user } = useSushiGo();

	const player = game.players.find(p => p.id === user.id);
	if (!player) {
		return null;
	}

	const playerIdx = game.players.indexOf(player);
	const passingToPlayer = game.players[playerIdx + 1 >= game.players.length ? 0 : playerIdx + 1];
	const receivingFromPlayer = game.players[playerIdx - 1 < 0 ? game.players.length - 1 : playerIdx - 1];

	return (
		<div className="player-hand-container">
			<motion.div id='pass-to' animate={{ opacity: [1, 0.2] }} transition={{ duration: 1, ease: "linear", repeat: Infinity, repeatType: "reverse" }}>
				<DoubleArrowLeftIcon width={70} height={70} />
				<div className='user-container'>
					<UserImage userID={passingToPlayer.id} />
					{passingToPlayer.username}
				</div>
			</motion.div>
			
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

			<motion.div id='receive-from' animate={{ opacity: [1, 0.2] }} transition={{ duration: 1, ease: "linear", repeat: Infinity, repeatType: "reverse" }}>
				<DoubleArrowLeftIcon width={70} height={70} />
				<div className='user-container'>
					<UserImage userID={receivingFromPlayer.id} />
					{receivingFromPlayer.username}
				</div>
			</motion.div>

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
		</div>
	);
}

export default PlayerHand;