import React from 'react';
import classes from './Spinner.module.css';

const spinner = () => (
    <div className={classes.fullscreen}>
        <div className={classes.Loader}>Loading...</div>
    </div>
);

export default spinner;