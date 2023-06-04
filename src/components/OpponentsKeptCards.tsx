import { ProtectedPlayer } from "../contexts/SushiGoContext";

const OpponentsKeptCards = ({ players }: { players: ProtectedPlayer[] }) => {
	return (
		<div className="other-players-hands-container">
			<div className="title">
				Opponents
			</div>
			<div className="other-players-hands">
				<div>
					{players.map(player => {
						return (
							<div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default OpponentsKeptCards;