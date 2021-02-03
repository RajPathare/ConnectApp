import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';

import { getProfileById } from '../../actions/profile';


const Profile = ({ getProfileById, match, profile: { profile, loading }, auth }) => {

    useEffect(() => {

        getProfileById(match.params.id);

    },[]);

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                
                <Link to="/profiles" className="btn">Back to Profiles</Link>

                {/* if the user is logged in and he/she views his own profile, show an edit button */}
                {auth.isAuthenticated && auth.loading === false && auth.user.user._id === profile.user._id && 

                (<Link to='/edit-profile' className="btn btn-dark">Edit Profile</Link>)}
                
            </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    profile: state.profile,
    // we need auth state here since if the user visits his profile, we will render an edit profile button
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile);
