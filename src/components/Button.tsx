import { MotionProps, motion } from "framer-motion";

const Button = ({ onClick, id, children }: { onClick?: React.MouseEventHandler<HTMLButtonElement>, id?: string, children: MotionProps['children'] }) => {
	return (
		<motion.button 
			id={id}
			style={{ backgroundColor: '#f0f0f0' }}
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