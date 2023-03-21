import { useRef, useEffect, useState } from "react";
import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { Card } from "./Cards";

export const PlayerHand = ({ hand }: { hand: GameCard[] }) => {
	const { socket } = useSushiGo();
	const [handWidth, setHandWidth] = useState(0);
	const ref = useRef<HTMLDivElement | null>(null);

	const hasRef = ref.current !== undefined;
	useEffect(() => {
		const onResize = () => setHandWidth(ref.current!.clientWidth);
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [hasRef]);

	const numCards = hand.length;
	const factor = 0.15 * numCards;
	const fanWidth = Math.min(handWidth * 0.5, numCards * 50);
	const fanHeight = fanWidth * 1.5;

	const cardAngle = (idx: number) => {
		let x = (idx - Math.floor(0.5 * numCards)) * 0.05;
		if (numCards % 2 === 0) {
			x += 0.025;
		}
		return x * (Math.PI / factor);
	}
	
	return (
		<div className="player-hand" ref={ref}>
			{hand.map((card, idx) => {
				const angle = cardAngle(idx);
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
			})}
		</div>
	);
}

export const PlayerKeptHand = ({ hand }: { hand: GameCard[] }) => {
	return (
		<div className="player-kept-hand">
			{hand.map(card => 
				<Card
					card={card}
					defaultStyle={{ position: 'relative' }}
				/>
			)}
		</div>
	);
}