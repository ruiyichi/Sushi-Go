import { MouseEventHandler, useEffect, useState } from "react";
import { SERVER_URI } from "../CONSTANTS";
import { Opponent, User, useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";
import CloseIcon from "../icons/CloseIcon";
import Overlay from "./Overlay";
import { axiosPrivate } from "../api/axios";
import MenuButton from "./MenuButton";
import { Player } from "../game/Player";

export const UserImage = ({ user, onClick, size=50 }: { user: User | Player | Opponent, onClick?: MouseEventHandler<HTMLImageElement>, size?: number }) => {
	return (
		<div className={classNames({
			'user-image-container': true,
			pointer: onClick !== undefined
		})}>
			<img 
				className='user-image'
				draggable={false}
				src={`${SERVER_URI}/images/profiles/${user.id}?${Date.now()}`} 
				alt={user.id}
				onClick={onClick}
				width={size}
				height={size}
			/>
			{user.username || 'username'}
		</div>
	);
};

const UserSettings = ({ setShow }: { setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [profilePictureFilenames, setProfilePictureFilenames] = useState<string[]>([]);
	const { user, updateUser } = useSushiGo();
	const logout = useLogout();

	useEffect(() => {
		const fetchProfilePictures = async () => {
			try {
				const filenamesResponse = await axiosPrivate.get('images/profilePictures');
				return filenamesResponse?.data?.urls|| [];
			} catch (e) {
				console.error(e);
				return [];
			}
		};
		
		fetchProfilePictures().then(profilePictures => setProfilePictureFilenames(profilePictures));
	}, []);
	
	return (
		<div className='user-settings-container'>
			<div className='content'>
				<CloseIcon
					width={25}
					onClick={() => setShow(false)}
				/>
				<div className='user-container'>
					<UserImage user={user} size={100} />
					<MenuButton onClick={async () => await logout() }>
						Log out
					</MenuButton>
				</div>
				<div className='profile-pictures-container'>
					{profilePictureFilenames.map(filename => (
						<img
							className='pointer'
							id='user-image'
							draggable={false}
							key={filename}
							src={`${SERVER_URI}/images/profilePictures/${filename}`}
							alt={filename}
							width={50}
							onClick={async () => {
								await axiosPrivate.post(`${SERVER_URI}/images/profilePicture`, { filename });
								updateUser({ profilePictureFilename: filename });
							}}
						>
						</img>
					))}
				</div>
			</div>
		</div>
	);
}

export const UserInfo = () => {
	const { user } = useSushiGo();
	const [showUserOverlay, setShowUserOverlay] = useState(false);

	return (
		<div className={classNames({
			"user-info-container": true,
			hidden: user.id === undefined
		})}>
			<UserImage user={user} size={50} onClick={() => setShowUserOverlay(open => !open)}/>
			<Overlay show={showUserOverlay} setShow={setShowUserOverlay}>
				<UserSettings setShow={setShowUserOverlay} />
			</Overlay>
		</div>
	);
}