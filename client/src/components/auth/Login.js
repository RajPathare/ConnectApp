import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

// we're using functional components here so we'll be using hooks
const Login = (props) => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onInputChange = (e) => {
        setFormData({
            // e.target.name can be username,email,password
            ...formData, [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        props.login(email, password);
    }


    if(props.isAuthenticated) {
        return <Redirect to="/dashboard" />
    }

    return (
        <Fragment>
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign into your account</p>
      <form className="form" onSubmit={(e)=> onSubmit(e)}>
       
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e)=> onInputChange(e)} required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} onChange={(e)=> onInputChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
        </Fragment>
    )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {
  login
})(Login);
