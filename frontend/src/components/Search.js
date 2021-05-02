import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import Loader from '../images/loader.gif';
import './Search.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Collapsible from './Collapsible';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import jsonQuery from 'json-query';
import RaisedButton from 'material-ui/RaisedButton';
import Courses from './Courses.js';
import Pagination from './Pagination.js';
import Tags from './Tags.js';




class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNo: 0,
            jobSkills:[],
            noSkills:["C++", "Software programming", "Database management"],
            isNoSkill:false,
            isChecked:false,
            submit:false,
            isTagClicked:false,

        }

        this.cancel = ''
    }

    getPageCount = (total, denominator) => {

        const divisible = 0 === total % denominator;
        const valueTobeAdded = divisible ? 0 : 1;
        return Math.floor(total / denominator) + valueTobeAdded;

    }

    fetchSearchResults = (updatedPageNo, query) => {

        const pageNumber = updatedPageNo ? `&offset=${updatedPageNo-1}` : '';
        const searchUrl = `https://ec.europa.eu/esco/api/search?text=${query}&type=occupation&type=skill&type=concept&facet=type&facet=isInScheme${pageNumber}&limit=20&full=true&language=en`

        if (this.cancel) {
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {
            cancelToken: this.cancel.token
        })
            .then(res => {

                const total = res.data.total;
                const totalPagesCount = this.getPageCount(total, 20);
                const resultsNotFoundMsg = !res.data._embedded.results.length
                    ? 'There are no more search results. Please try a new search.'
                    : `${res.data.total} search results found`; 
                               
                this.setState({
                    results: res.data._embedded.results,
                    message: resultsNotFoundMsg,
                    totalResults: total,
                    totalPages: totalPagesCount,
                    currentPageNo: updatedPageNo,
                    loading: false
                })
            })
            .catch(error => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch the data. Please check the network.'
                    })

                }

            })

    };

    //handle user input search
    handleOnInputChange = (event) => {
        const query = event.target.value;
        if (!query) {
            this.setState({ query, results: {}, message: '', totalPages:0, totalResults:0 });
        }
        else {
            this.setState({ query, loading: true, message: '' }, () => {
                this.fetchSearchResults(1, query);
            });
        }
    };


/*     //handle previous and next options
    handlePageClick = (type) => {
        //event.preventDefault();
        const updatePageNo = 'prev' === type 
        ? this.state.currentPageNo - 1 
        : this.state.currentPageNo + 1;

        if(!this.state.loading){
            this.setState({loading:true, message:''},()=>{
                this.fetchSearchResults(updatePageNo, this.state.query);
            })
        }

    } */


    //handling checkBox functions
    handleToggle = (value) => {

        const currentIndex = this.state.jobSkills.indexOf(value);
        const newChecked = [...this.state.jobSkills];

        if (currentIndex === -1) {
            newChecked.push(value);
        }

        else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({ jobSkills: newChecked, isChecked: true })
    }

    //Submit skills button 
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
      this.setState({isNoSkill:true, submit:true})
    }


  }

  //navigate through page numbers
  paginate = (number) => {
    //event.preventDefault();
    const updatePageNo = number

    if(!this.state.loading){
        this.setState({loading:true, message:''},()=>{
            this.fetchSearchResults(updatePageNo, this.state.query);
        })
    }

}
     //handles when user click on a tag
    handleTagClick = (tagTitle) => {
        const pageNum=1;

        if(!this.state.loading){
            this.setState({query:tagTitle,loading:true, message:''},()=>{
                this.fetchSearchResults(pageNum, this.state.query);
            })
        }
    };

    renderSearchResults = () => {
        const { results, jobSkills } = this.state;
        const utopian = Object.keys(this.state.results);
        
        console.log(this.state.results);
    
        var title = jsonQuery('[*][title]', { data: this.state.results }).value
        var info = jsonQuery('[*][uri]', { data: this.state.results }).value
        

        if (Object.keys(results).length && results.length) {
            return (
                <MuiThemeProvider>
                 {this.state.submit|| this.state.isNoSkill?(this.state.jobSkills.length>0?<div className="course-results"><Courses skillList={this.state.jobSkills}/></div>:<div className="course-results"><Courses skillList={this.state.noSkills}/></div>):
                  <div className="results-container">
                    { utopian.map((post, i) => {
                      return <Collapsible
                        key={i} title={title[i]} info={info[i]}>
                        <FormGroup>
                          {((jsonQuery(`[${i}][_links][hasEssentialSkill][*][title]`, { data: this.state.results }).value)).map((skillItem, j) =>
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
                        {((jsonQuery(`[${i}][_links][hasEssentialSkill][*][title]`, { data: this.state.results }).value)).length > 0 ?
                          <RaisedButton label="Submit" type="submit" onClick={() =>this.onClick()} primary={true} />
                          : <RaisedButton label="No skills available, go to courses" type="submit" onClick={() =>this.onClickNoSkills(title[i])} primary={true} />}

                      </Collapsible>

                    })
                        }
                    </div>
                    }
                </MuiThemeProvider>
            )
        }
    };



    render() {

        const { query, loading, message, currentPageNo, totalPages} = this.state;

        const showPrevLink = 1 < currentPageNo;
        const showNextLink = totalPages > currentPageNo;
        

        return (
            <div className="container">

                {/* ...........Heading............. */}
                <header className="heading">
                    <h1>Search</h1>
                </header>

                {/* ...........Search input............. */}
                    <label className="search-label" htmlFor="search-input">
                        <input
                            type="text"
                            value={query}
                            name="query"
                            id="search-input"
                            placeholder="Search..."
                            onChange={this.handleOnInputChange}
                        />
                        <div className="search-icon">
                            <SearchIcon />
                        </div>
                    </label>

                    {/* ...........Error message............. */}
                    {message && <p className={`message ${!this.state.isChecked && !this.state.submit?'show':'hide'}`}>{message}</p>}


                    {/* ...........Loader............. */}
                    <img src={Loader} className={`search-loading ${loading ? 'show' : 'hide'}`} alt="loaderIcon" />

                    {/*.............Tags....................*/}
                    <div className={`job-tags ${this.state.submit?'hide':'show'}`}>{this.state.isTagClicked ?'':
                    <Tags 
                    handleClick={this.handleTagClick}   />}
                    </div>

                
                {/* ..............Page Navigation.......... */}
                <div className="pagination">
                     <Pagination
                        showNextLink={showNextLink}
                        showPrevLink={showPrevLink}
                        totalPages={this.state.totalPages}
                        paginate={this.paginate}
                        submit={this.state.submit}
                        isNoSkill={this.state.isNoSkill}
                        currentPage={this.state.currentPageNo}
                    />  


                </div>

                {/* ..............Dispaly current Page Number.......... */}
                <div className={`page-num-display ${ this.state.results.length>0 && !this.state.isChecked && !this.state.submit ? 'show' : 'hide'}`}> 
                {`Showing page ${this.state.currentPageNo}  of ${this.state.totalPages}`}
                </div>



                    {/* ...........Results............. */}
                    {this.renderSearchResults()}
 
            </div>            
        );
    }
}


export default Search;