import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';


import { logoutUser } from '../redux/actions/userActions';
import { connect } from 'react-redux';

const styles = {
    icon: {
        fill: '#ffffff'
    },
    
}

class AppBarComp extends Component {

    handleLogout = () => {
        this.props.logoutUser();
    }

    render() {

        const { classes, authenticated } = this.props;
        return (
            <AppBar>
                <ToolBar className="nav-container">
                    <Typography variant="h6">
                        EduRecApp
                    </Typography>
                    {authenticated ?
                        <span style={{ marginLeft: '650px' }}>
                            <Button color="inherit" component={Link} to="/">Home</Button>
                            <Button color="inherit" component={Link} to="/search">Search</Button>
                            <Button color="inherit" component={Link} to="/favorites">Favorites</Button>
                            <Button color="inherit" component={Link} to="/contactus">Contacts</Button>
                            <Button color="inherit" component={Link} to="/myprofile">Profile</Button>
                            <Tooltip title="Logout" placement="top">
                                <IconButton onClick={this.handleLogout}>
                                    <ExitToAppIcon className={classes.icon} />
                                </IconButton>
                            </Tooltip>
                        </span>
                        :
                        <span style={{ marginLeft: '800px' }}>
                            <Button color="inherit" component={Link} to="/login">Log in</Button>
                            <Button color="inherit" component={Link} to="/signup">Sign up</Button>
                        </span>
                    }

                </ToolBar>
            </AppBar>
        );
    }
}

AppBarComp.propTypes = {
    user: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    authenticated: state.user.authenticated
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(AppBarComp));