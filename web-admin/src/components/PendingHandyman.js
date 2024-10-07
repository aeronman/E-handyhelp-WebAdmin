import React, { useState, useEffect } from 'react';
import { Button, Modal, Table , Form} from 'react-bootstrap';
import axios from 'axios';
import './styles.css';

const PendingHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [pendingHandymen, setPendingHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch pending handymen from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/handymen/pending') // Fetching from backend
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

  // Filtering handymen based on the search term
  const filteredHandymen = pendingHandymen.filter((handyman) => {
    const fullName = `${handyman?.fname || ''} ${handyman?.lname || ''}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (handyman?.contact && handyman.contact.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="content-container pending-handyman">
      <h2>Pending Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by Name or Contact"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredHandymen.map((handyman) => (
            <tr key={handyman._id}>
              <td>{handyman.fname} {handyman.lname}</td>
              <td>{handyman.accounts_status || 'Pending Handyman'}</td>
              <td>
                <Button variant="primary" onClick={() => handleOpenModal(handyman)}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

              {/* Conditional rendering for valid ID placeholder */}
              {selectedHandyman.validID ? (
                <p><strong>Valid ID:</strong> {selectedHandyman.validID}</p>
              ) : (
                <p><strong>Valid ID:</strong> <em>No ID provided</em></p>
              )}
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
