import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Alert from './components/layout/Alert';


class App extends React.Component {
    render() {
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
}

export default App;