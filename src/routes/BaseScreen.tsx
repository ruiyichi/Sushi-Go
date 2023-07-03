import conveyorBeltSushi from '../assets/conveyor_belt_sushi.gif';
import Logo from '../components/Logo';
import { UserInfo } from '../components/User';

const BaseScreen = ({ id, children }: { id: string, children?: React.ReactNode }) => {
	return (
		<div className='base-screen' id={id} style={{ backgroundImage: `url(${conveyorBeltSushi})`}}>
			<UserInfo />
			<Logo />
			{children}
		</div>
	);
}

export default BaseScreen;