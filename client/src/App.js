import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Alert from './components/layout/Alert';

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
                    </Switch>
                </section>
            </Fragment>
        </Router>
    )

}

export default connect(null,{
    loadUser
})(App);