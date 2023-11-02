import React, { MouseEventHandler, useEffect, useState } from "react";
import { SERVER_URI } from "../CONSTANTS";
import { Opponent } from "../contexts/GameContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";
import CloseIcon from "../icons/CloseIcon";
import Overlay from "./Overlay";
import { axiosPrivate } from "../api/axios";
import MenuButton from "./MenuButton";
import { Player } from "../game/Player";
import { BasicUser } from "../interfaces";
import { motion } from "framer-motion";
import CheckIcon from "../icons/CheckIcon";
import { User, useUser } from "../contexts/UserContext";

export const UserImage = ({ user, onClick, size=50, label, orientation="vertical" }: { user: User | Player | Opponent | BasicUser, onClick?: MouseEventHandler<HTMLImageElement>, size?: number, label?: string, orientation?: "horizontal" | "vertical" }) => {
	return (
		<div className={classNames({
			'user-image-container': true,
			'horizontal': orientation === "horizontal"
		})}>
			<motion.img 
				className={classNames({
					'user-image': true,
					pointer: onClick !== undefined
				})}
				draggable={false}
				src={!user.id ? '' : `${SERVER_URI}/images/profiles/${user.id}?${Date.now()}`} 
				alt={user.id}
				onClick={onClick}
				width={size}
				height={size}

				whileHover={{ scale: onClick ? 1.1 : 1 }}
			/>
			{label || user.username || 'username'}
		</div>
	);
};

const ProfilePicture = ({ current, filename, onClick }: { current: boolean, filename: string, onClick: MouseEventHandler<HTMLImageElement> }) => {
	return (
		<div>
			{ current && 
				<>
					<CheckIcon width={50} height={50} />
					<motion.div id='overlay' />
				</>
			}
			<motion.img
				className='pointer'
				id='user-image'
				draggable={false}
				key={filename}
				src={`${SERVER_URI}/images/profilePictures/${filename}`}
				alt={filename}
				width={50}
				onClick={onClick}

				whileHover={{ scale: 1.1 }}
			>
			</motion.img>
		</div>
	);
}

const UserSettings = ({ setShow }: { setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [profilePictureFilenames, setProfilePictureFilenames] = useState<string[]>([]);
	const { user, updateUser } = useUser();
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
						<ProfilePicture	current={filename === user.profilePicture} filename={filename} onClick={async () => {
							await axiosPrivate.post(`${SERVER_URI}/images/profilePicture`, { filename });
							updateUser({ profilePicture: filename });
						}} />
					))}
				</div>
			</div>
		</div>
	);
}

export const UserInfo = () => {
	const { user } = useUser();
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