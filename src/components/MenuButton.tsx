import { MotionProps, motion } from "framer-motion";

const MenuButton = ({ onClick, children }: { onClick?: React.MouseEventHandler<HTMLButtonElement>, children: MotionProps['children'] }) => {
	return (
		<motion.button 
			className='menu-button pointer'
			whileTap={{
				scale: 0.9
			}}
			onClick={onClick}
			children={children}
		/>
	);
}

export default MenuButton;