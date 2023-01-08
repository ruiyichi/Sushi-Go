import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext({} as AuthContextInterface);

interface AuthContextInterface { 
	state: State
	dispatch: React.Dispatch<any>
};
interface AuthProviderProps { children: React.ReactNode };

interface State {
	auth: boolean;
};

type Action = 
	| { type: 'login' }
	| { type: 'logout' };

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const reducer = (state: State, action: Action) => {
		switch (action.type) {
			case 'login':
				return { ...state, auth: true };
			case 'logout':
				return { ...state, auth: false };
			default:
				throw new Error();
		}
	}

	const [state, dispatch] = useReducer(reducer, { auth: false } as State);

	const value: AuthContextInterface = { 
		state,
		dispatch
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);