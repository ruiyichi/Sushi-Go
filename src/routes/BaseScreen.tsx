import conveyorBeltSushi from '../assets/conveyor_belt_sushi.gif';

const BaseScreen = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className='base-screen-container'>
			<img id='background-image' src={conveyorBeltSushi} />
			{children}
		</div>
	);
}

export default BaseScreen;