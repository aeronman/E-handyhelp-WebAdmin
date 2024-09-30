import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { FaUserTimes } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const RejectedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectedUsers, setRejectedUsers] = useState([]);

  // Fetch rejected users from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/users/rejected') // Fetching from backend
      .then((response) => {
        setRejectedUsers(response.data); // Set the fetched users in state
      })
      .catch((error) => {
        console.error('Error fetching rejected users:', error);
      });
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="content-container rejected-user">
      <h2>Rejected Users</h2>
      <div className="user-list">
        {rejectedUsers.map((user) => (
          <Card key={user._id} className="user-card">
            <Card.Body>
              <FaUserTimes className="icon" />
              <Card.Title>{user.fname} {user.lname}</Card.Title>
              <Card.Text>Email: {user.email}</Card.Text>
              <Card.Text>Account Status: {user.accounts_status}</Card.Text>
              <Button variant="primary" onClick={() => handleOpenModal(user)}>View Details</Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Modal for user details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <h5>Name: {selectedUser.fname} {selectedUser.lname}</h5>
              <p>Email: {selectedUser.email}</p>
              <p>Contact: {selectedUser.contact}</p>
              <p>Date of Birth: {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
              <p>Account Status: {selectedUser.accounts_status}</p>
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

export default RejectedUser;
