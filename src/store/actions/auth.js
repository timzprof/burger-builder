import axios from 'axios';
import * as actionTypes from './actionTypes';

const { REACT_APP_API_KEY: API_KEY } = process.env;

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
}

export const authSuccess = (authObj) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: {
            idToken: authObj.idToken,
            userId: authObj.localId
        }
    };
}

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error
    };
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
};

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = { email, password, returnSecureToken: true };
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`;
        if(!isSignUp){
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`;
        }
        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.date.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(error => {
                dispatch(authFailed(error.response.data.error));
            });
    };
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess({ idToken: token, localId: userId }));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }else {
                dispatch(logout());
            }
        }
    }
}