import classNames from "classnames";

const Overlay = ({ show, setShow, children }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, children?: React.ReactNode }) => {
	return (
		<div 
			onClick={e => {
				if (e.target === e.currentTarget) {
					setShow(false)
				}
			}}
			className={classNames({ 
				overlay: true, 
				hidden: !show
			})}
		>
			{children}
		</div>
	);
}

export default Overlay;