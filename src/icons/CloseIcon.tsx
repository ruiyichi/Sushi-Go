import { MouseEventHandler } from "react";

const CloseIcon = ({ width=20, height=20, onClick }: { width?: number, height?: number, onClick?: MouseEventHandler } ) => {
	return (
		<svg
			className='pointer'
			id='close-icon'
			width={width}
			height={height}
			viewBox={"0 0 24 24"}
			onClick={onClick}
		>
			<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
		</svg>
	);
}

export default CloseIcon;