import { motion } from 'framer-motion';
import maki from '../assets/maki.png';

const Loading = () => {
	return (
		<div className='loading-container'>
			<motion.img 
				src={maki}
				alt='Sushi'
				animate={{
					y: ["0%", "-50%", "-40%", "0%"],
					scale: 1,
					rotate: [0, 0, 345, 360],
					transition: { 
						duration: 1.6, 
						repeat: Infinity,
						times: [0, 0.3, 0.55, .75],
					}
				}}
			/>
			Loading...
		</div>
	);
}

export default Loading;