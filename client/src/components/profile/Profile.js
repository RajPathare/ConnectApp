import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';

import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGitHub from './ProfileGitHub';

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

                <div className="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />

                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {profile.experience.length > 0 ? (<Fragment>

                            {profile.experience.map((exp) => (
                                <ProfileExperience key={exp._id} experience={exp} />
                            ))}

                        </Fragment>) : (<h4>No experience credentials</h4>)}

                    </div>


                    <div className="profile-edu bg-white p-2">
                        <h2 className="text-primary">Education</h2>
                        {profile.education.length > 0 ? (<Fragment>

                            {profile.education.map((edu) => (
                                <ProfileEducation key={edu._id} education={edu} />
                            ))}

                        </Fragment>) : (<h4>No education credentials</h4>)}

                    </div>

                    {profile.githubusername && (<ProfileGitHub username={profile.githubusername} />)}

                </div>
                
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
