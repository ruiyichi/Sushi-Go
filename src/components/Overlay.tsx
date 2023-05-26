import classNames from "classnames";
import { ReactElement } from "react";

const Overlay = ({ show, setShow, children }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, children?: ReactElement<any, any> }) => {
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