import { MouseEventHandler, useState } from "react";
import { SERVER_URI } from "../CONSTANTS";
import { useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";

const UserInfo = () => {
	const { user } = useSushiGo();
	const logout = useLogout();
	const [open, setOpen] = useState(false);

	const UserImage = ({ onClick }: { onClick?: MouseEventHandler<HTMLImageElement>}) => {
		return (
			<img 
				src={`${SERVER_URI}/images/profiles/${user.id}`} 
				alt={user.id}
				onClick={onClick}
			/>
		);
	};

	const UserInfoDialog = () => {
		return (
			<dialog
				onBlur={() => setOpen(false)}
				id='user-info-dialog'
				style={{ visibility: open ? 'inherit' : 'hidden' }}
				open={open}
				ref={dialog => dialog && dialog.focus()}
			>
				<div className='user-info-dialog-container'>
					<div className='profile-picture-container'>
						<UserImage />
						{user.username}
					</div>
					<button
						onClick={async () => {
							await logout();
						}}
					>
						Log out
					</button>
				</div>
			</dialog>
		);
	}

	return (
		<div className={classNames({
			"user-info-container": true,
			hidden: user.id === undefined
		})}>
			<UserImage onClick={() => setOpen(open => !open)}/>
			<UserInfoDialog />
		</div>
	);
}

export default UserInfo;