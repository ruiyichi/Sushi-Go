import { MouseEventHandler, useEffect, useState } from "react";
import { SERVER_URI } from "../CONSTANTS";
import { useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";
import CloseIcon from "../icons/CloseIcon";
import Overlay from "./Overlay";
import { axiosPrivate } from "../api/axios";

const UserImage = ({ onClick, size=50 }: { onClick?: MouseEventHandler<HTMLImageElement>, size?: number }) => {
	const { user } = useSushiGo();
	return (
		<img 
			draggable={false}
			src={`${SERVER_URI}/images/profiles/${user.id}?${Date.now()}`} 
			alt={user.id}
			onClick={onClick}
			width={size}
			height={size}
		/>
	);
};

const ProfilePictureSelection = ({ setShow }: { setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [profilePictureFilenames, setProfilePictureFilenames] = useState<string[]>([]);
	const { updateUser } = useSushiGo();

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
		<div className='profile-picture-selection-container'>
			<UserImage size={100} />
			<div className='profile-pictures-container'>
				{profilePictureFilenames.map(filename => {
					return (
						<img
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
			<CloseIcon
				width={25}
				onClick={() => setShow(false)}
			/>
		</div>
	);
}

const UserInfoDialog = ({ open, setOpen, setShow }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const { user } = useSushiGo();
	const logout = useLogout();

	return (
		<dialog
			className={classNames({ hidden: !open })}
			open={open}
		>
			<CloseIcon 
				onClick={() => setOpen(false)}
			/>
			<div className='user-info-dialog-container'>
				<div className='profile-picture-container'>
					<UserImage onClick={() => setShow(show => !show)}/>
					{user.username}
				</div>
				<button
					onClick={async () => await logout() }
				>
					Log out
				</button>
			</div>
		</dialog>
	);
}

const UserInfo = () => {
	const { user } = useSushiGo();
	const [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
	const [showProfilePictureSelection, setShowProfilePictureSelection] = useState(false);

	return (
		<div className={classNames({
			"user-info-container": true,
			hidden: user.id === undefined
		})}>
			<UserImage onClick={() => setOpenUserInfoDialog(open => !open)}/>
			<UserInfoDialog open={openUserInfoDialog} setOpen={setOpenUserInfoDialog} setShow={setShowProfilePictureSelection} />
			<Overlay show={showProfilePictureSelection} setShow={setShowProfilePictureSelection}>
				<ProfilePictureSelection setShow={setShowProfilePictureSelection} />
			</Overlay>
		</div>
	);
}

export default UserInfo;