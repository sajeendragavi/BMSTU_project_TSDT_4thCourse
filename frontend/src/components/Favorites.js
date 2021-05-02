import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Card, CardBody, CardLink, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';



import { connect } from 'react-redux';
import { unLikeJobs, unLikeCourse } from '../redux/actions/userActions';


const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 600,
    },

    paper: {
        padding: 20
    },

    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});


class Favorites extends Component {

    constructor(props) {
        super(props);

        this.state = {

            value: 0,

        };
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    handleJobDisLike(e, title) {
        e.preventDefault();

        const unfavJob = {
            jobName: title,
            userEmail: this.props.user.credentials.email,
        };

        this.setState({ liked: false });

        this.props.unLikeJobs(unfavJob);
    };

    handleCourseDisLike(e, title) {
        e.preventDefault();

        const favCourse = {
            courseTitle: title,
            userEmail: this.props.user.credentials.email,
        };

        this.setState({ liked: false });
        this.props.unLikeCourse(favCourse);
    }


    render() {

        const { classes,
            theme,
            user: { favJobs, favorites, loading, authenticated } } = this.props;


        let favoriteMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <Container maxWidth="sm" >
                    <div className={classes.root}>
                        <div position="static" color="default">
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                            >
                                <Tab label="Jobs" />
                                <Tab label="Courses" />
                            </Tabs>
                        </div>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={this.state.value}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            <TabContainer dir={theme.direction}>

                                {favJobs && favJobs.map((job, i) => {
                                    return (
                                        <Card key={i}>
                                            <CardBody>
                                                <CardTitle tag="h4">{job.jobTitle}</CardTitle>
                                                <CardLink href={`${job.jobLink}`}>Find out more</CardLink>
                                            </CardBody>
                                            <Tooltip style={{ marginLeft: 450 }} title="Remove from favorites" placement="top">
                                                <IconButton onClick={(e) => this.handleJobDisLike(e, job.jobTitle)} className="button">
                                                    <FavoriteIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                        </Card>
                                    )
                                })}

                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                {favorites && favorites.map((course, i) => {
                                    return (
                                        <Card key={i}>
                                            <CardBody>
                                                <CardTitle tag="h4">{course.courseName}</CardTitle>
                                                <CardSubtitle tag="h6">{`Platform: ${course.courseOrg}`}</CardSubtitle>
                                                <CardText style={{ paddingTop: '10px' }}>{`This course is offered by ${course.courseUni}`}</CardText>
                                                <CardLink href={`${course.courseLink}`}>Course Link</CardLink>
                                            </CardBody>
                                            <Tooltip style={{ marginLeft: 450 }} title="Remove from favorites" placement="top">
                                                <IconButton onClick={(e) => this.handleCourseDisLike(e, course.courseName)} className="button">
                                                    <FavoriteIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                        </Card>
                                    )
                                })}

                            </TabContainer>
                        </SwipeableViews>
                    </div>
                </Container>
            </Paper>

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
                        <h1>Favorites</h1>
                    </header>
                    {favoriteMarkup}
                </div>
            </MuiThemeProvider>

        );
    }
}

Favorites.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    unLikeJobs: PropTypes.func.isRequired,
    unLikeCourse: PropTypes.func.isRequired,

};

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};


const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = { unLikeJobs, unLikeCourse };


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, { withTheme: true })(Favorites));
