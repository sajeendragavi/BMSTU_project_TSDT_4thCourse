import React from 'react';
import './Home.scss';
import Collapsible from './Collapsible';
import fire from './Fire';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import jsonQuery from 'json-query';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Courses from './Courses.js';
import 'bootstrap/dist/css/bootstrap.css';



class Home extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);

    this.state = {
      isLoading: true,
      escoJobs: [],
      jobSkills:[],
      noSkills:["C++", "Software programming", "Database management"],
      isNoSkill:false,
      isChecked:false,
      submit:false,
      //liked:false,
      //likedJobs: [],
    }

  }
  abortController = new AbortController();

  componentDidMount() {
    this.fetchData();

  }

  fetchData() {

    this.setState({
      isLoading: true,
      escoJobs: []
    })



    fetch('https://ec.europa.eu/esco/api/search?text=software engineer&type=occupation&type=skill&type=concept&facet=type&facet=isInScheme&limit=20&full=true&language=en',
      { signal: this.abortController.signal })
      .then(response => response.json())
      .then(parsedJSON => parsedJSON._embedded.results)
      .then(escoJobs => this.setState({
        escoJobs,
        isLoading: false
      }))

      .catch(error => console.log('parsing failed', error))

  }

  componentWillUnmount() {
    this.abortController.abort();

  }

  //logging out of an account
  logout() {
    fire.auth().signOut();
  }

  //handling checkBox functions
  handleToggle=(value)=>{

    const currentIndex=this.state.jobSkills.indexOf(value);
    const newChecked=[...this.state.jobSkills];

    if(currentIndex===-1){
      newChecked.push(value);
    }

    else{
      newChecked.splice(currentIndex,1);
    }

    this.setState({jobSkills:newChecked, isChecked:true})
  }

  //Submit selected skills button 
  onClick = () => {

    if (this.state.jobSkills.length > 0) {
      this.setState({ submit: true })
    }
    else {
      this.setState({ submit: false })
    }
  }

  //If no skills defined
  onClickNoSkills=(courseTitle)=>{

    if(courseTitle.length>0){
      this.state.noSkills.push(courseTitle);
      this.setState({isNoSkill:true})
    }


  }


  render() {
    const { isLoading, escoJobs, jobSkills } = this.state;
    //console.log(this.state.jobSkills);


    const utopian = Object.keys(this.state.escoJobs);
    console.log(this.state.escoJobs);

    var title = jsonQuery('[*][title]', { data: this.state.escoJobs }).value
    var info = jsonQuery('[*][uri]', { data: this.state.escoJobs }).value

    return (
        <MuiThemeProvider>
          <div className="main-content">
          {/* -------Display Jobs------------- */}
          <div>
          <h1> Welcome!</h1>
            <header>
              <h3>Explore ESCO jobs with us...</h3>
            </header>
            <h4>What is ESCO?</h4>
            <p>ESCO is the multilingual classification of European Skills, Competences, 
               Qualifications and Occupations. ESCO is part of the Europe 2020 strategy.
               The ESCO classification identifies and categorises skills, competences, 
               qualifications and occupations relevant for the EU labour market and education and training. 
               It systematically shows the relationships between the different concepts. 
            </p>
            <p>Find out more about <a href="https://ec.europa.eu/esco/portal/home">ESCO</a></p>
            <h4>Here are some job suggestions that you might be interested in...</h4>
            <p>Click on the expand icon to view the skills of each job. Then select the skills you are interested in developing and 
               click on submit to see the relevant courses for them.
            </p>

            {/* {escoJobs.length} search results found */}
            <div className={`content ${isLoading ? 'is-loading' : ''}`}>

            {/*-----if the skills are selected or no skills available and then submit, show the courses------*/}
            {this.state.submit || this.state.isNoSkill?(this.state.jobSkills.length>0?<Courses skillList={this.state.jobSkills}/>
            :<Courses skillList={this.state.noSkills}/>):
              <div className="panel-group">
                {
                  !isLoading && escoJobs.length > 0 ?
                    utopian.map((post, i) => {
                      return <Collapsible
                        key={i} 
                        title={title[i]} 
                        info={info[i]} 
                        /* index={i} 
                        jobs={this.state.escoJobs}  */
                        /* handleLike={this.handleLike} */>
                        <FormGroup>
                          {((jsonQuery(`[${i}][_links][hasEssentialSkill][*][title]`, { data: this.state.escoJobs }).value)).map((skillItem, j) =>
                            <FormControlLabel
                              key={j}
                              control={
                                <Checkbox
                                onChange={() => this.handleToggle(skillItem)}
                                  checked={jobSkills.indexOf(skillItem) === -1 ? false : true} />}
                              label={skillItem}
                            />
                          )}

                        </FormGroup>
                        {((jsonQuery(`[${i}][_links][hasEssentialSkill][*][title]`, { data: this.state.escoJobs }).value)).length > 0 ?
                          <RaisedButton label="Submit" type="submit" onClick={() =>this.onClick()} primary={true} />
                          : <RaisedButton label="No skills available, go to courses" type="submit" onClick={() =>this.onClickNoSkills(title[i])} primary={true} />}

                      </Collapsible>

                    }) : null
                }
              </div>
            }
              <div className="loader">
                <div className="icon"></div>
              </div>
            </div>
          </div>
          {/* -------End of Display Jobs------------- */}
          </div>
        </MuiThemeProvider>
    );
  }
}

export default Home;
