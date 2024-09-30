import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const PendingHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [pendingHandymen, setPendingHandymen] = useState([]);

  // Fetch pending handymen from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/handymen/pending')  // Fetching from backend
      .then((response) => {
        setPendingHandymen(response.data); // Set the fetched handymen in state
      })
      .catch((error) => {
        console.error('Error fetching handymen:', error);
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

  const handleVerifyHandyman = () => {
    if (selectedHandyman) {
      axios.put(`http://localhost:5000/api/handymen/${selectedHandyman._id}/verify`)
        .then(() => {
          setPendingHandymen(pendingHandymen.map(handyman =>
            handyman._id === selectedHandyman._id ? { ...handyman, accounts_status: 'verified' } : handyman
          ));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error verifying handyman:', error);
        });
    }
  };

  const handleRejectHandyman = () => {
    if (selectedHandyman) {
      axios.put(`http://localhost:5000/api/handymen/${selectedHandyman._id}/reject`)
        .then(() => {
          setPendingHandymen(pendingHandymen.map(handyman =>
            handyman._id === selectedHandyman._id ? { ...handyman, accounts_status: 'rejected' } : handyman
          ));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error rejecting handyman:', error);
        });
    }
  };

  return (
    <div className="content-container pending-handyman">
      <h2>Pending Handymen</h2>
      <div className="handyman-list">
        {pendingHandymen.map((handyman) => (
          <Card key={handyman._id} className="handyman-card">
            <Card.Body>
              <FaTools className="icon" />
              <Card.Title>{handyman.fname} {handyman.lname}</Card.Title>
              <Card.Text>{handyman.accounts_status || 'Pending Handyman'}</Card.Text>
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
              <p>Description: {selectedHandyman.accounts_status || 'Pending Handyman'}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>Specialization: {selectedHandyman.specialization.join(', ')}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="success" onClick={handleVerifyHandyman}>Verify</Button>
          <Button variant="danger" onClick={handleRejectHandyman}>Reject</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingHandyman;
