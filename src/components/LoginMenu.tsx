import { useNavigate } from "react-router-dom";
import { MotionProps, motion } from "framer-motion";

const LoginMenu = () => {
	const navigate = useNavigate();

	const Button = ({ onClick, children }: { onClick: React.MouseEventHandler<HTMLButtonElement>, children: MotionProps['children'] }) => {
		return (
			<motion.button 
				whileHover={{
					backgroundColor: '#8E181B'
				}}
				whileTap={{
					scale: 0.9
				}}
				onClick={onClick}
				children={children}
			/>
		);
	}

	return (
		<div className='login-menu'>
			<Button onClick={() => navigate('login')}>
				Log In
			</Button>
			<Button onClick={() => navigate('register')}>
				Sign up
			</Button>
		</div>
	);
}

export default LoginMenu;