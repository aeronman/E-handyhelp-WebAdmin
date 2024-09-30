import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { FaUserSlash } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const SuspendedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [suspendedHandymen, setSuspendedHandymen] = useState([]);

  // Fetch suspended handymen from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/handymen/suspended') // Update this to your actual API endpoint
      .then((response) => {
        setSuspendedHandymen(response.data); // Set the fetched handymen in state
      })
      .catch((error) => {
        console.error('Error fetching suspended handymen:', error);
      });
  }, []);

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  return (
    <div className="content-container suspended-handyman">
      <h2>Suspended Handymen</h2>
      <div className="handyman-list">
        {suspendedHandymen.map((handyman) => (
          <Card key={handyman.id} className="handyman-card">
            <Card.Body>
              <FaUserSlash className="icon" />
              <Card.Title>{handyman.fname} {handyman.lname}</Card.Title>
              <Card.Text>Email: {handyman.email}</Card.Text>
              <Card.Text>Account Status: {handyman.accounts_status}</Card.Text>
              <Button variant="primary" onClick={() => handleOpenModal(handyman)}>View Details</Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Modal for handyman details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Handyman Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHandyman && (
            <>
              <h5>Name: {selectedHandyman.fname} {selectedHandyman.lname}</h5>
              <p>Email: {selectedHandyman.email}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>Specialization: {selectedHandyman.specialization.join(', ')}</p>
              <p>Account Status: {selectedHandyman.accounts_status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuspendedHandyman;
