import { SET_COURSES, LOADING_DATA, LIKED_COURSES } from '../types';


const initialState ={
    courses:[],
    likedCourse:{},
    loading :false
};

export default function(state= initialState, action){
    switch(action.type){
        case LOADING_DATA:
        return{
            ...state,
            loading: true
        }
        case SET_COURSES:
        return{
            ...state,
            courses:action.payload,
            loading:false
        };
        case LIKED_COURSES:
        let index= state.courses.findIndex((likedCourse)=>likedCourse.courseId===action.payload.courseId);
        state.courses[index]=action.payload;
        return{
            ...state
        };

        default:
            return state;
    }
}