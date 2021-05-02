import React from 'react';
import fire from './Fire';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import TextField from 'material-ui/TextField';
import CourseImg from '../images/1.jpg';
import Platforms from './Platforms.js';
import 'bootstrap/dist/css/bootstrap.css';
import Cards from './Cards.js'

import { connect } from 'react-redux';

class Courses extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            results: [],
            skills: this.props.skillList,
            count: 0,
            arrObj: [],
            filterText: 'All',
            tagClicked: false,

        }

    }

    componentDidMount() {
        const courseRef = fire.database().ref('courses');
        courseRef.on('value', (snapshot) => {
            let courses = snapshot.val();
            let newState = [];

            for (let course in courses) {
                newState.push({
                    id: courses[course].course_id,
                    courseName: courses[course].course_name,
                    courseOrg: courses[course].provider,
                    courseUniversity: courses[course].universities,
                    courseLink: courses[course].url

                });
            }
            this.setState({
                results: newState
            });
        });

    }

    //check whether the course name contains skills
    matchSkillsAndCourses = (str1, str2, org, image, uni, link) => {
        var array = str1.split(" ");
        var res;

        array.forEach(element => {
            // console.log(element);
            if (str2.toUpperCase().includes(element.toUpperCase()) &&
                !str2.toUpperCase().includes(("English").toUpperCase()) &&
                !str2.toUpperCase().includes(("Economics").toUpperCase()) &&
                !str2.toUpperCase().includes(("Business").toUpperCase()) &&
                !str2.toUpperCase().includes(("Writing").toUpperCase()) &&
                !str2.toUpperCase().includes(("Economy").toUpperCase()) &&
                !str2.toUpperCase().includes(("Health").toUpperCase()) &&
                !str2.toUpperCase().includes(("Agricultural").toUpperCase()) &&
                !str2.toUpperCase().includes(("Earth").toUpperCase()) &&
                !str2.toUpperCase().includes(("Sports").toUpperCase())) {
                res = true;
            }
            else res = false

        });

        if (res) {
            this.state.arrObj.push({
                crsName: str2,
                crsOrg: org,
                crsImg: image,
                crsUni: uni,
                crsLink: link,
            });
        }
    }

    showCard = () => {

        let op;

        if (this.state.filterText !== 'All') {
            op = this.state.arrObj.filter(obj => (obj.crsOrg === this.state.filterText))
        }

        else {
            op = this.state.arrObj;
        }

        if (op.length > 0) {
            return (
                <Container fluid>
                    <p>{`Found ${op.length} search results`}</p>
                    <Row>
                        {op.map((obj, i) => {
                            return (
                                <Col key={i} sm="4">
                                    <Cards
                                        crsName={obj.crsName}
                                        crsImg={obj.crsImg}
                                        crsOrg={obj.crsOrg}
                                        crsUni={obj.crsUni}
                                        crsLink={obj.crsLink}
                                    />
                                </Col>
                            )
                        }
                        )}
                    </Row>
                </Container>
            );
        }

        else return  <p>Found 0 search results</p>
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleTagClick = (tagTitle) => {

        this.setState({ filterText: tagTitle, tagClicked: true })

    };


    render() {

        return (
            <div>
                <h1>Courses</h1>
                <Container fluid>
                    <Row xs="1" sm="2" md="4">
                        <Col>
                            <TextField
                                type="text"
                                floatingLabelText="Platform"
                                hintText="Filter by platform"
                                value={this.state.filterText}
                                onChange={this.handleChange}
                                name="filterText"
                                id="filterText"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Platforms
                            handleClick={this.handleTagClick} />
                    </Row>
                </Container>
                <div style={{ paddingTop: '20px' }}>
                    {this.state.results.map((course, i) => {
                        return (
                            <div key={i}>
                                {this.state.skills.map((sk, j) => {
                                    return (
                                        <div key={j}>
                                            {/********Check from word to word in skills of course name*/}
                                            {this.matchSkillsAndCourses(sk, course.courseName, course.courseOrg, CourseImg, course.courseUniversity, course.courseLink)}
                                        </div>)
                                })}
                            </div>
                        )
                    })}
                    {this.showCard()}
                </div>

            </div>
        );
    }
}


Courses.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});


export default connect(mapStateToProps)(Courses);
