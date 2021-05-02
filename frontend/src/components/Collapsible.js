import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { likeJobs, unLikeJobs } from '../redux/actions/userActions';
import { connect } from 'react-redux';



//import EscoLogo from '../images/esco_logo.jpg';   TODO or Maybe



class Collapsible extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isExpanded: false,
            liked: false,
            likedJobs: [],
        }
    }

    handleToggle(e) {
        e.preventDefault();
        this.setState({
            isExpanded: !this.state.isExpanded,
            height: this.refs.inner.clientHeight

        })
    }

    handleLike(e, title, info) {
        e.preventDefault();

        const favJob = {
            jobTitle: title,
            jobLink: info,
            userEmail: this.props.user.credentials.email,
        };

        this.setState({ liked: true });

        this.props.likeJobs(favJob);

    }

    handleDisLike(e, title) {
        e.preventDefault();

        const unfavJob = {
            jobName: title,
            userEmail: this.props.user.credentials.email,
        };

        this.setState({ liked: false });

        this.props.unLikeJobs(unfavJob);
    }

    render() {
        const { title, children, info  } = this.props;
        const { isExpanded, height } = this.state;
        const currentHeight = isExpanded ? height : 0;
        return (
            <div className={`panel ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="panel-heading">
                    <h2 style={{ paddingTop: '10px' }} >{title}</h2>
                    <a href={info}>Find out more about this job here</a><br /><br /><br />
                    {this.state.liked ? (
                        <Tooltip style={{ marginLeft: 600 }} title="Remove from favorites" placement="top">
                            <IconButton onClick={(e) => this.handleDisLike(e, title)} className="button">
                                <FavoriteIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                            <Tooltip style={{ marginLeft: 600 }} title="Add to favorites" placement="top">
                                <IconButton onClick={(e) => this.handleLike(e, title, info)} className="button">
                                    <FavoriteBorderIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        )}

                    <Tooltip style={{ marginLeft: 10 }} title="View skills" placement="top">
                        <IconButton onClick={(e) => this.handleToggle(e)} className="button">
                            <ExpandMoreIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="panel-collapse" style={{ height: currentHeight + 'px' }}>
                    <div className="panel-body" style={{ height: 'auto' }} ref="inner" onClick={onEditClick}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }

}

function onEditClick(e) {
    e.stopPropagation();
}

Collapsible.propTypes = {
    title: PropTypes.string,
    user: PropTypes.object.isRequired,
    likeJobs: PropTypes.func.isRequired,
    unLikeJobs: PropTypes.func.isRequired

};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = { likeJobs, unLikeJobs };

export default connect(mapStateToProps, mapActionsToProps)(Collapsible);