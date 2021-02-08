import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import Routes from './components/routing/Routes';

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
                <Switch>
                    <Route exact path='/' component={Landing} />
                    <Routes component={Routes} />
                </Switch>
            </Fragment>
        </Router>
    )

}

export default connect(null,{
    loadUser
})(App);