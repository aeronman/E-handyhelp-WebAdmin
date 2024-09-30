import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const VerifiedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [verifiedHandymen, setVerifiedHandymen] = useState([]);

  // Fetch verified handymen from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/handymen/verified') // Fetching from backend
      .then((response) => {
        setVerifiedHandymen(response.data); // Set the fetched handymen in state
      })
      .catch((error) => {
        console.error('Error fetching verified handymen:', error);
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
    <div className="content-container verified-handyman">
      <h2>Verified Handymen</h2>
      <div className="handyman-list">
        {verifiedHandymen.map((handyman) => (
          <Card key={handyman._id} className="handyman-card">
            <Card.Body>
              <FaCheckCircle className="icon" />
              <Card.Title>{handyman.fname} {handyman.lname}</Card.Title>
              <Card.Text>{handyman.accounts_status || 'Verified Handyman'}</Card.Text>
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
              <p>Description: {selectedHandyman.accounts_status || 'Verified Handyman'}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>Specialization: {selectedHandyman.specialization.join(', ')}</p>
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

export default VerifiedHandyman;
