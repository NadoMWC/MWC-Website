

const EventForm = ({ existingInformation }) => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Create Event</h2>
        <form className="space-y-3">
          <div className="flex flex-col">
            <label className="font-medium">Name</label>
            <input className="border rounded p-2" type="text" />{existingInformation.title}
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Address</label>
            <input className="border rounded p-2" type="text" />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Phone</label>
            <input className="border rounded p-2" type="tel" />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Email</label>
            <input className="border rounded p-2" type="email" />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Cost</label>
            <input className="border rounded p-2" type="text" />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Date</label>
            <input className="border rounded p-2" type="date" />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Time</label>
            <input className="border rounded p-2" type="time" />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium">Notes</label>
            <textarea className="border rounded p-2" rows="3">{existingInformation.description}</textarea>
          </div>
  
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
            Save Event
          </button>
        </form>
      </div>
    );
  };
  
  export default EventForm;
  