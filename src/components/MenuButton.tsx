import { MotionProps, motion } from "framer-motion";

const MenuButton = ({ onClick, children }: { onClick?: React.MouseEventHandler<HTMLButtonElement>, children: MotionProps['children'] }) => {
	return (
		<motion.button 
			className='menu-button pointer'
			whileHover={{
				boxShadow: 'none',
				scale: 0.95
			}}
			whileTap={{
				scale: 0.9
			}}
			onClick={onClick}
		>
			{children}
		</motion.button>
	);
}

export default MenuButton;