import { SET_COURSES, LOADING_DATA, LIKE_COURSES, LIKED_COURSES } from '../types';
import axios from 'axios';


//get all courses
export const getCourses=()=>dispatch=>{
    dispatch({type:LOADING_DATA});
    axios.get('/courses')
    .then(res=>{
        dispatch({
            type:SET_COURSES,
            payload:res.data
        })
    })
    .catch(err=>{
        dispatch({
            type:SET_COURSES,
            payload:[]
        })
    })
}

//get liked courses
export const getLikedCourses =()=>dispatch=>{
    dispatch({type: LOADING_DATA});
    axios
    .get('/courses/like')
    .then((res)=>{
        dispatch({
            type:LIKED_COURSES,
            payload:res.data
        });
    })
    .catch((err)=>{
        dispatch({
            type:LIKED_COURSES,
            payload:[]
        });
    });
    
};
