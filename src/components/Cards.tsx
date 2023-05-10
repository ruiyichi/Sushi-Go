import { useState } from "react";
import { CARD_IMAGES } from "../game/Images";

export const Card = ({ cardName, onClick=() => {}, style }: { cardName: string, onClick?: Function, style?: Record<string, any> }) => {
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
				src={CARD_IMAGES[cardName]}
				onLoad={() => setLoaded(true)}
				width={100} 
				height={150}
				draggable={false}
			/>
		</div>
	);
}