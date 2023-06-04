import { MouseEventHandler, useEffect, useState } from "react";
import { SERVER_URI } from "../CONSTANTS";
import { useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";
import CloseIcon from "../icons/CloseIcon";
import Overlay from "./Overlay";
import { axiosPrivate } from "../api/axios";
import Button from "./Button";

const UserImage = ({ onClick, size=50 }: { onClick?: MouseEventHandler<HTMLImageElement>, size?: number }) => {
	const { user } = useSushiGo();
	return (
		<img 
			id='user-image'
			draggable={false}
			src={`${SERVER_URI}/images/profiles/${user.id}?${Date.now()}`} 
			alt={user.id}
			onClick={onClick}
			width={size}
			height={size}
		/>
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
					<UserImage size={100} />
					{user.username}
					<Button
						onClick={async () => await logout() }
					>
						Log out
					</Button>
				</div>
				<div className='profile-pictures-container'>
					{profilePictureFilenames.map(filename => {
						return (
							<img
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
						);
					})}
				</div>
			</div>
			
			<Button id='close-button' onClick={() => setShow(false)}>Close</Button>
		</div>
	);
}

const UserInfo = () => {
	const { user } = useSushiGo();
	const [showUserOverlay, setShowUserOverlay] = useState(false);

	return (
		<div className={classNames({
			"user-info-container": true,
			hidden: user.id === undefined
		})}>
			<UserImage size={50} onClick={() => setShowUserOverlay(open => !open)}/>
			<Overlay show={showUserOverlay} setShow={setShowUserOverlay}>
				<UserSettings setShow={setShowUserOverlay} />
			</Overlay>
		</div>
	);
}

export default UserInfo;