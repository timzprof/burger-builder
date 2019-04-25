import React from 'react';
import classes from './Spinner.module.css';

const spinner = (props) => (
    <div className={props.fullscreen ? classes.fullscreen : ''}>
        <div className={classes.Loader}>Loading...</div>
    </div>
);

export default spinner;