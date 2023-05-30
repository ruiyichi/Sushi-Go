import { MotionProps, motion } from "framer-motion";

const Button = ({ onClick, children }: { onClick?: React.MouseEventHandler<HTMLButtonElement>, children: MotionProps['children'] }) => {
	return (
		<motion.button 
			whileHover={{
				backgroundColor: '#2c89d6'
			}}
			whileTap={{
				scale: 0.9
			}}
			onClick={onClick}
			children={children}
		/>
	);
}

export default Button;