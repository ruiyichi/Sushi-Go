import { useState } from "react";
import { CARD_FILES } from "../game/Images";

export const Card = ({ cardName, height=150, onClick=() => {}, style }: { cardName: string, height?: number, onClick?: Function, style?: React.CSSProperties }) => {
	const [loaded, setLoaded] = useState(false);

	return (
		<div
			className="card"
			onClick={() => onClick()}
			style={style}
		>
			<div className="card-info">
				{cardName}
			</div>
			<img 
				style={{ visibility: loaded ? 'inherit' : 'hidden' }}
				src={CARD_FILES[cardName].image}
				onLoad={() => setLoaded(true)}
				height={height}
				draggable={false}
				alt={cardName}
			/>
		</div>
	);
}

export const CardIcon = ({ cardName, height=50, style }: { cardName : string, height?: number, style?: React.CSSProperties }) => {
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