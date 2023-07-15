const CheckIcon = ({ width=20, height=20 }: { width?: number, height?: number} ) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox={"0 0 24 24"}
		>
			<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
		</svg>
	);
}

export default CheckIcon;