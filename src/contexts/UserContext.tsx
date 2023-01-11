import { createContext, useContext, useReducer } from "react";

const UserContext = createContext({} as UserContextInterface);

interface UserContextInterface { 
	user: User,
	updateUser: React.Dispatch<any>
};
interface UserProviderProps { children: React.ReactNode };

interface User {
	auth: boolean,
	username: string,
	id: number
};

export const UserProvider = ({ children }: UserProviderProps) => {
	const reducer = (user: User, payload: User) => {
		return { ...user, ...payload };
	}

	const [user, updateUser] = useReducer(reducer, { auth: false } as User);

	const value: UserContextInterface = { 
		user,
		updateUser
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
}

export const useUser = () => useContext(UserContext);