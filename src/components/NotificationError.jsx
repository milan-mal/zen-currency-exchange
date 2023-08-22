import PropTypes from 'prop-types';

const NotificationError = ({ messageError }) => {
    if ( messageError === null )
        return null

    return (
        <div className="NotificationError" >
            {messageError}
        </div>
    )
}

NotificationError.propTypes = {
    messageError: PropTypes.string
}

export default NotificationError