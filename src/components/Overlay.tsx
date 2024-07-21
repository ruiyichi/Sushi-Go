import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

interface OverlayProps {
	show: boolean, 
	setShow: React.Dispatch<React.SetStateAction<boolean>>, 
	children?: React.ReactNode
}
const Overlay: FC<OverlayProps> = ({ show, setShow, children }) => {
	return (
		<AnimatePresence>
			<motion.div 
				key='overlay'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={e => {
					if (e.target === e.currentTarget) {
						setShow(false)
					}
				}}
				className={classNames({ 
					overlay: true, 
					pointer: true,
					hidden: !show,
				})}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}

export default Overlay;