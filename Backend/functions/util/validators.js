//checking for empty input fields
const isEmpty = (str) => {
    if (str.trim() === '') return true
    else return false;
}

//check whether input is an email address
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.match(regEx)) return true;
    else return false;

}

exports.validateSignupData = (data) => {
    //field validation
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    }
    else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    }

    if (isEmpty(data.password)) errors.password = 'Must not be empty'
    if (data.password != data.confirmPassword) errors.confirmPassword = 'Passwords must match';


    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };

};

exports.validateLoginData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty'

    if (isEmpty(data.password)) errors.password = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

//TODO add more user details
exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if (!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};