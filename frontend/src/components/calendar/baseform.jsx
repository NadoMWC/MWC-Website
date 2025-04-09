import './calendar.css'


function BaseModal({ closeModal, events, setShowEventForm, setBaseForm, setSelectedEvent, date }) {

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setBaseForm(false);
        setShowEventForm(true);
    };

    const createNewEvent = () => {
        setBaseForm(false);
        setShowEventForm(true);
    };

    return (
        <>
            <h1>{date}</h1>

                {/* IF there are events, THEN display them, otherwise, say "No Events" */}
                {events && events.length > 0 ? (events.map((event, index) => (
                    <button onClick={() => handleEventClick(event)} key={index}>
                        {event.title}
                    </button>
                ))) : (<p>No events</p>)}

            <button onClick={createNewEvent}>Create New Event</button>
            <button onClick={closeModal}>Close Modal</button>
        </>);
};

export default BaseModal;