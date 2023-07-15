import { motion } from 'framer-motion';
import maki from '../assets/maki.png';

const Loading = ({ title='Loading...' }) => {
	return (
		<div className='loading-container'>
			<motion.img 
				src={maki}
				alt='Sushi'
				animate={{
					y: ["0%", "-50%", "-20%", "0%"],
					scale: 1,
					rotate: [0, 0, 360, 360],
					transition: { 
						duration: 1.6, 
						repeat: Infinity,
						times: [0, 0.25, 0.475, .65],
					}
				}}
			/>
			{title}
		</div>
	);
}

export default Loading;