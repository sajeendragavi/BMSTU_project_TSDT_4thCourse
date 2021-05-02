import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER } from '../types';
import axios from 'axios';


export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
        .then((res) => {
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })

        });
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
        .then((res) => {
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })

        });
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
}

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => console.log(err));

};

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
};



export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user/image', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err))
};

//like courses
export const likeCourse =(courseData)=>dispatch=>{
    dispatch({ type: LOADING_UI });
    axios
        .post('/course/like', courseData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
}

//unlike courses
export const unLikeCourse =(courseData)=>dispatch=>{
    dispatch({ type: LOADING_UI });
    axios
        .post('/course/unlike', courseData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
}

//like jobs
export const likeJobs = (jobData) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/job/like', jobData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
}

//unlike jobs
export const unLikeJobs = (jobData) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/job/unlike', jobData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
}

export const sendEmail = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/user/emailus', userData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
}

//Sign in with google
export const signInGoogle = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signInGoogle', userData)
        .then((res) => {
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })

        });
};

//signup with Google
export const signUpGoogle = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signUpGoogle', newUserData)
        .then((res) => {
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })

        });
} 

//Sign in with Facebook
export const signInFacebook = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signInFacebook', userData)
        .then((res) => {
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })

        });
};

//signup with Facebook
export const signUpFacebook = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signUpFacebook', newUserData)
        .then((res) => {
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })

        });
} 
