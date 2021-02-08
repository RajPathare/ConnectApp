import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = (props) => {

    const { isAuthenticated, loading } = props.auth;

    const authLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/dashboard">
            <i className="fas fa-user"></i>{' '}
            <span className="hide-sm">Dashboard</span></Link>
            </li>
            <li>
                <Link onClick={props.logout} to="#!">
                <i className="fas fa-sign-out-alt"></i>{' '}
                <span className="hide-sm">Logout</span></Link>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>   
    );

    const renderLinks = () => {
        if(!loading) {
            return (
                <Fragment>
                    {isAuthenticated ? authLinks: guestLinks}
                </Fragment>
            )
        }
    }

    return (
        <nav className="navbar bg-dark">
            <h1>
            <Link to="/">ConnectApp</Link>
            </h1>
            {renderLinks()}
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, {
    logout
})(Navbar);