import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {


    const experiences = experience.map((elem) => {
        return (
            <tr key={elem._id}>
                <td>{elem.company}</td>
                <td className="hide-sm">{elem.title}</td>
                <td>
                    <Moment format='YYYY/MM/DD'>{elem.from}</Moment> - { elem.to == null ? ('Now') : (<Moment format='YYYY/MM/DD'>{elem.to}</Moment> ) }
                </td>
                <td>
                    <button onClick={() => deleteExperience(elem._id)} className="btn btn-danger">Delete</button>
                </td>
            </tr>
        )
    } ) 



    return (
        <Fragment>
            <h2 className="my-2">Experience credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {experiences}
                </tbody>
            </table>
            
        </Fragment>
    )
}

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
}

export default connect(null, { deleteExperience })(Experience);
