import { createContext, useContext, useReducer } from "react";

export type User = {
	id: string,
	username: string,
	accessToken: string,
	profilePicture: string
};

type UserAction = { type: 'update', payload: User } | { type: 'clear'};

type UserContextValue = {
	user: User,
  updateUser: React.Dispatch<any>,
	clearUser: React.Dispatch<any>,
};

const UserContext = createContext({} as UserContextValue);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userReducer: React.Reducer<User, UserAction> = (user: User, action: UserAction) => {
		switch (action.type) {
			case 'update':
				return { ...user, ...action.payload };
			case 'clear':
				return {} as User;
			default:
				return user;
		}
	}
	const [user, dispatchUser] = useReducer(userReducer, {} as User);

	const updateUser = (payload: User) => {
		dispatchUser({ type: 'update', payload });
	}

	const clearUser = () => {
		dispatchUser({ type: 'clear' });
	}

  const value: UserContextValue = {
    user,
    updateUser,
    clearUser
  };

  return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);