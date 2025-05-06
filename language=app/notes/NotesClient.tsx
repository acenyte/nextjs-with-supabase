import React, { useState } from 'react';

const NotesClient: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
  };

  return (
    <div>
      {openModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setOpenModal(false)} className="close-button">X</button>
            <form onSubmit={handleSubmit}>
              <label htmlFor="thumbnail">Thumbnail URL:</label>
              <input type="text" id="thumbnail" name="thumbnail" required style={{ border: "1px solid black" }} />
              <br />
              <label htmlFor="description">Description:</label>
              <textarea id="description" name="description" required style={{ border: "1px solid black" }}></textarea>
              <br />
              <button type="submit">Add Note</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesClient; 