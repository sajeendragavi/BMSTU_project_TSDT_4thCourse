import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'reactstrap';




const Tags = ({ handleClick }) => {

const tagNames=["IT consultant", "Web developer", "Cloud architect","Mobile application developer","Computer Systems Analyst",
"Software engineer","Health IT specialist", "Data Modeler", "Computer Network Architect","User Interface Designer"]

    return (
        <div>
            <ul>
            {tagNames.map((TagTitle,i) => (
                <Button key={i} onClick={() => handleClick(TagTitle)} color="primary" style={{marginTop:'10px', borderRadius:'30px'}} size="sm">{TagTitle}</Button>
            ))}
            </ul>
        </div>
    );
};

export default Tags;
