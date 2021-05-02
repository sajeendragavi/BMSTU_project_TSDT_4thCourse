import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardText, CardBody, CardLink,CardTitle, CardSubtitle} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { likeCourse, unLikeCourse } from '../redux/actions/userActions';
import { connect } from 'react-redux';


class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
        }
    }

    handleLike(e, name, image, organization, university, link) {
        e.preventDefault();

        const favCourse = {
            crsName: name,
            crsImg: image,
            crsOrg: organization,
            crsUni: university,
            crsLink: link,
            userEmail: this.props.user.credentials.email,
        };

        this.setState({ liked: true });

        this.props.likeCourse(favCourse);
    }

    handleDisLike(e, title) {
        e.preventDefault();

        const favCourse = {
            courseTitle: title,
            userEmail: this.props.user.credentials.email,
        };

        this.setState({ liked: false });
        this.props.unLikeCourse(favCourse);
    }

    render() {

        const{crsName, crsImg, crsOrg, crsUni, crsLink}=this.props;
        return (
            <div>
                <Card className="course-cards">
                    <CardBody>
                        <CardTitle tag="h4">{crsName}</CardTitle>
                    </CardBody>
                    <img style={{ paddingTop: '10px' }} className="card-img" width="100%" src={crsImg} alt="Card cap" />
                    <CardBody>
                        <CardSubtitle tag="h6">{`Platform: ${crsOrg}`}</CardSubtitle>
                        <CardText style={{ paddingTop: '10px' }}>{`This course is offered by ${crsUni}`}</CardText>
                        <CardLink href={`${crsLink}`}>Course Link</CardLink>
                    </CardBody>
                    <CardBody>
                        {this.state.liked ?
                            (
                                <Tooltip style={{ marginLeft: 150 }} title="Remove from favorites" placement="top">
                                    <IconButton onClick={(e) => this.handleDisLike(e, crsName)} className="button">
                                        <FavoriteIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip style={{ marginLeft: 150 }} title="Add to favorites" placement="top">
                                    <IconButton onClick={(e) => this.handleLike(e, crsName, crsImg, crsOrg, crsUni, crsLink)} className="button">
                                        <FavoriteBorderIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                    </CardBody>
                </Card>
            </div>
        )
    }
}

Cards.propTypes = {
    user: PropTypes.object.isRequired,
    likeCourse: PropTypes.func.isRequired,
    unLikeCourse: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = { likeCourse, unLikeCourse };

export default connect(mapStateToProps, mapActionsToProps)(Cards);