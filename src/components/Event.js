import { useState } from "react";
import PropTypes from "prop-types";

const Event = ({ event }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };

    // Handle date formatting to ensure it's a valid date string
    const formattedDate = new Date(event.date).toLocaleString();
    
    return (
        <li className="event">
            <h2 className="event-title">{event.title}</h2>
            <p className="event-location">{event.location}</p>
            <button className="details-button" onClick={toggleDetails}>
                {showDetails ? "Hide Details" : "Show Details"}
            </button>
            {showDetails && (
                <div className="event-details">
                    {event.description && <p className="event-description">{event.description}</p>}
                    {event.date && <p className="event-date">{formattedDate}</p>}
                    {event.time && <p className="event-time">{event.time}</p>}
                </div>
            )}
        </li>
    );
};

Event.propTypes = {
    event: PropTypes.shape({
        title: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        description: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
    }).isRequired
};

export default Event;