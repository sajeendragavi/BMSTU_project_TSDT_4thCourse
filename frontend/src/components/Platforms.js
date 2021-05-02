import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'reactstrap';

const Platforms = ({ handleClick }) => {

const tagNames=["All","Coursera", "edX", "Udacity","Canvas.net","Open education by blackboard",
                "Miríada X","NovoED", "FutureLearn", "OpenSAP","OpenHPI", "OpenLearning"]

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

export default Platforms;
