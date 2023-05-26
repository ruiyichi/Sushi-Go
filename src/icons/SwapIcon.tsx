const SwapIcon = ({ width=20, height=20 }: { width?: number, height?: number} ) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox={"0 0 24 24"}
		>
			<path d="M16 17V10h-2v7h-3L15 21l4-4h-3zM9 3 5 7h3V14h2V7h3L9 3z"></path>
		</svg>
	);
}

export default SwapIcon;