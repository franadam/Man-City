import {firebase} from '../../firebase';

import * as actionTypes from './actionTypes';

export const authStart = () => {
		return {
				type: actionTypes.AUTH_START
		};
};

export const authSuccess = (token, userID) => {
		return {
				type: actionTypes.AUTH_SUCCESS,
				token,
				userID
		};
};

export const authLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userID');
		localStorage.removeItem('expirationDate');
		return {
				type: actionTypes.AUTH_LOGOUT
		};
};

export const logout = () => {
	return dispatch => {
		firebase.auth().signOut()
		.then(() => {
			console.log('log out successfuly');
		})
		.catch(error => {
			console.log(error);
		});
		dispatch(authLogout())
	}
}

export const checkAuthTimeout = (expTime) => {
		return dispatch => {
				setTimeout(() => {
						dispatch(logout());
				}, expTime * 1000)
		};
};

export const authFail = (error) => {
		return {
				type: actionTypes.AUTH_FAIL,
				error: error
		};
};

export const auth = (email, password, isSignup) => {
	return async dispatch => {
		dispatch(authStart());
		try {
			let snapshot;

			if (isSignup) {
				snapshot = await firebase.auth().signInWithEmailAndPassword(email, password);
			}
			else {
				snapshot = await firebase.auth().createUserWithEmailAndPassword(email, password);
			}

			console.log(snapshot);
			const user = snapshot.user;
			const token = await user.getIdTokenResult();
			const expirationTime = token.claims.exp - token.claims.iat;
			console.log('token: ', token);
			localStorage.setItem('token', token.token);
			localStorage.setItem('userID', user.uid);
			localStorage.setItem('expirationDate', token.expirationTime);
			dispatch(authSuccess(token.token, user.uid));
			dispatch(checkAuthTimeout(expirationTime));
		} catch (error) {
			const errorMessage = error.message;
			console.log(errorMessage, error);
			dispatch(authFail(error));
		}
	};
};

export const setAuthRedirectPath = (path) => {
		return {
				type: actionTypes.SET_AUTH_REDIRECT_PATH,
				path: path
		}
};

export const authCheckState = () => {
		return dispatch => {
				const token = localStorage.getItem('token');
				if (!token) {
						dispatch(logout());
				} else {
						const expirationDate = new Date(localStorage.getItem('expirationDate'));
						if (expirationDate <= new Date()) {
								dispatch(logout());
						} else {
							const userID = localStorage.getItem('userID');
								dispatch(authSuccess(token, userID));
								dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
						}
				}
		};
};