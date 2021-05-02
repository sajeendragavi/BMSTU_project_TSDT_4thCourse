import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import { FormGroup, Label, Input } from 'reactstrap';
import CalendarToday from '@material-ui/icons/CalendarToday'
import dayjs from 'dayjs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import LocationOn from '@material-ui/icons/LocationOn';
import EmailIcon from '@material-ui/icons/Email';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';


import { uploadImage, editUserDetails } from '../redux/actions/userActions';
import { connect } from 'react-redux';

const styles = {

    paper: {
        padding: 20
    },
    toolTip: {
        marginLeft: 500
    },

    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%',
        },
        '& .profile-details': {
            textAlign: 'center'
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }

};

class MyProfile extends Component {

    constructor() {
        super()

        this.state = {

            name: '',
            email: '',
            phonenumber: '',
            bio: '',
            location: '',
            clickSave: false,

        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    Save = (e) => {
        e.preventDefault();
        this.setState({ clickSave: true })

        const userDetails = {
            bio: this.state.bio ? this.state.bio : this.props.user.credentials.bio,
            email: this.state.email ? this.state.email : this.props.user.credentials.email,
            location: this.state.location ? this.state.location : this.props.user.credentials.location,
            name: this.state.name ? this.state.name : this.props.user.credentials.name,
            phoneNumber: this.state.phoneNumber ? this.state.phonenumber : this.props.user.credentials.phoneNumber,

        };
        this.props.editUserDetails(userDetails);

    };

    handleEditDetails = (e) => {
        e.preventDefault();
        this.setState({ clickSave: false })

    };


    //send chnaged image to server 
    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);     


    };

    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    }

    render() {

        const { classes,
            user: {
                credentials: { email, createdAt, imageUrl, bio, location, name, phoneNumber },
                loading,
                authenticated
            }
        } = this.props;

        let profileMarkup = !loading ? (authenticated ? (
            this.state.clickSave ?
                (<Paper className={classes.paper}>
                    <Tooltip className={classes.toolTip} title="Edit profile details" placement="top">
                        <IconButton onClick={this.handleEditDetails} className="button">
                            <EditIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <div className={classes.profile}>
                        <div className="image-wrapper">
                            <img src={imageUrl} alt="profile" className="profile-image" />
                        </div>
                        <hr />
                        <div className="profile-details">
                            {this.state.bio ? <Typography variant="body2">{this.state.bio}</Typography> :
                                <Typography variant="body2">{bio}</Typography>}
                            <hr />
                            {this.state.name ? <Typography variant="body2">{this.state.name}</Typography> :
                                <Typography variant="body2">{name}</Typography>}
                            <hr />
                            {this.state.email ? (
                                <Fragment>
                                    <EmailIcon color="primary" /> <span>{this.state.email}</span>
                                    <hr />
                                </Fragment>
                            ) :
                                (
                                    <Fragment>
                                        <EmailIcon color="primary" /> <span>{email}</span>
                                        <hr />
                                    </Fragment>
                                )}
                            <hr />
                            {this.state.location ? (
                                <Fragment>
                                    <LocationOn color="primary" /> <span>{this.state.location}</span>
                                    <hr />
                                </Fragment>
                            ) :
                                (
                                    <Fragment>
                                        <LocationOn color="primary" /> <span>{location}</span>
                                        <hr />
                                    </Fragment>
                                )}
                            <hr />
                            {this.state.phonenumber ? (
                                <Fragment>
                                    <PhoneAndroidIcon color="primary" /> <span>{this.state.phonenumber}</span>
                                    <hr />
                                </Fragment>
                            ) :
                                (
                                    <Fragment>
                                        <PhoneAndroidIcon color="primary" /> <span>{phoneNumber}</span>
                                        <hr />
                                    </Fragment>
                                )}
                            <hr />
                            <CalendarToday color="primary" />{' '}
                            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                        </div>
                    </div>
                </Paper>
                ) :
                (
                    <Paper className={classes.paper}>
                        <div className={classes.profile}>
                            <div className="image-wrapper">
                                <img className="profile-image" src={imageUrl} alt="profile" />
                                <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
                                <Tooltip title="Edit profile picture" placement="top">
                                    <IconButton onClick={this.handleEditPicture} className="button">
                                        <EditIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <hr />
                            <div className="profile-details">
                                <FormGroup>
                                    <Label for="name">Name:</Label>
                                    <Input defaultValue={name} type="text" name="name" id="name" onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email">Email:</Label>
                                    <Input defaultValue={email} type="email" name="email" id="email" onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="phonenumber">Phone Number:</Label>
                                    <Input defaultValue={`Ex: ${phoneNumber}`} type="text" name="phonenumber" id="phonenumber" onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="bio">Bio:</Label>
                                    <Input defaultValue={bio} type="text" name="bio" id="bio" onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="location">Location:</Label>
                                    <Input defaultValue={location} type="text" name="location" id="location" onChange={this.handleChange} />
                                </FormGroup>

                                <CalendarToday color="primary" /> {' '}
                                <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                            </div>
                            <hr />

                            <div className={classes.buttons}>
                                <Button variant="contained" color="primary" onClick={this.Save}>Save</Button>
                            </div>
                        </div>
                    </Paper>
                )

        ) :
            (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">
                        Your session expired. Please sign in again
                </Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to="/login">Sign in</Button>{'    '}
                        <Button variant="contained" color="secondary" component={Link} to="/signup">Sign up</Button>
                    </div>
                </Paper>
            )) : (<p>loading...</p>);

        return (
            <MuiThemeProvider>
                <div className="container" style={{ textAlign: 'center' }}>
                    <header>
                        <h1>My profile</h1>
                    </header>
                    {profileMarkup}
                </div>
            </MuiThemeProvider>


        );
    }
}

MyProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    editUserDetails: PropTypes.func.isRequired
};



const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = { editUserDetails, uploadImage };


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(MyProfile));
