import './dashboard.css'
import React, { useState, useEffect } from "react";
import axios from "axios";


function Dashboard() {
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/event/')
            .then(response => {
                setEventData(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Event Details</h1>
            {eventData ? (
                <div>
                    <h2>{eventData.title}</h2>
                    <p><strong>Date:</strong> {eventData.date}</p>
                    <p><strong>Time:</strong> {eventData.time}</p>
                    <p><strong>Description:</strong> {eventData.description}</p>
                </div>
            ) : (
                <p>Loading event data...</p>
            )}
        </div>
    );
}

//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         axios.get("http://127.0.0.1:8000/api/events/")
//             .then((response) => {
//                 console.log("API Response:", response.data); // ✅ Debugging line
//                 setEvents(response.data);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 console.error("Error fetching API:", error);
//                 setLoading(false);
//             });
//     }, []);

//     if (loading) return <p>Loading...</p>;

//     return (
//         <div>
//             <h1>Events</h1>
//             {events.length === 0 ? (
//                 <p>No events found.</p>
//             ) : (
//                 <ul>
//                     {events.map((event, index) => (
//                         <li key={index}>
//                             <strong>{event.title}</strong> - {event.date} at {event.time}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }

export default Dashboard;