import './dashboard.css'
import React, { useState, useEffect } from "react";
import axios from "axios";


function Dashboard() {
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/calendar/view_events/')
            .then(response => {
                setEventData(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const stringData = JSON.stringify(eventData, null, 2);

    return (
        <div>
            <p>{stringData}</p>
        </div>

    );
}

export default Dashboard;