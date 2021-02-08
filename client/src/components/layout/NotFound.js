import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const NotFound = () => {
    return (
        <Fragment>
            <h1 className="x-large text-primary">
                <i className="fas fa-exclamation-triangle"></i> Page not found!
            </h1>
        </Fragment>
    )
}

NotFound.propTypes = {

}

export default NotFound;
