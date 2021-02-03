import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

import PrivateRoute from './components/routing/PrivateRoute';

import Alert from './components/layout/Alert';

import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';

import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';

import Profiles from './components/profiles/Profiles';

import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

if(localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = (props) => {

    useEffect(()=> {
        props.loadUser()
    },[])
// [] => run only once (componentDidMount)

    return (
        <Router>
            <Fragment>
                <Navbar />
                <Route exact path='/' component={Landing} />
                <section className="container">
                    <Alert />
                    <Switch>
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/profiles' component={Profiles} />
                        <PrivateRoute exact path='/dashboard' component={Dashboard} />
                        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
                        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
                        <PrivateRoute exact path='/add-experience' component={AddExperience} />
                        <PrivateRoute exact path='/add-education' component={AddEducation} />
                    </Switch>
                </section>
            </Fragment>
        </Router>
    )

}

export default connect(null,{
    loadUser
})(App);