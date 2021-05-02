import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER,LIKED_COURSES, UNLIKE_COURSES, LIKED_JOBS } from '../types';


const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    favJobs:[]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading:false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        case LIKED_COURSES:
        return{
            ...state,
            likes:[
             ...state.likes,
             {
                 userEmail:state.credentials.email,
                 courseId:action.payload.courseId
             }   
            ]
        }   ;
        case LIKED_JOBS:
        return{
            ...state,
            favJobs:[
             ...state.favJobs,
             {
                 userEmail:state.credentials.email,
                 jobLink:action.payload.jobLink,
                 jobTitle:action.payload.jobTitle
             }   
            ]
        }   ;
        case UNLIKE_COURSES:
        return{
            ...state,
            likes: state.likes.filter(
                (like)=>like.courseId !== action.payload.courseId
            )
        }; 
        default:
            return state;
    }
}