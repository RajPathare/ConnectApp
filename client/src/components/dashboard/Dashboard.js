import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

import Spinner from '../layout/Spinner';

import DashboardActions from './DashboardActions';

import Experience from './Experience';
import Education from './Education';

const Dashboard = (props) => {

    useEffect(()=> {
        props.getCurrentProfile();
    },[]);

    return props.profile.loading && props.profile.profile ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">
            Dashboard
        </h1>
        <p className="lead">
            {/* && operator here -> if props.auth.user is present, only then show the username */}
            <i className="fas fas-user"></i> Welcome { props.auth.user && props.auth.user.user.name }
        </p>
        { props.profile.profile !== null ? <Fragment>
            <DashboardActions />
            <Experience  experience={props.profile.profile.experience} />
            <Education  education={props.profile.profile.education} />

            <div className="my-2">
                <button onClick={() => props.deleteAccount()} className="btn btn-danger">Delete Account</button>
            </div>

        </Fragment> : <Fragment>
            <p>You have not set a profile, please add some info!</p>
            <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</Link>
        </Fragment> }

    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {
    getCurrentProfile,
    deleteAccount
})(Dashboard);
