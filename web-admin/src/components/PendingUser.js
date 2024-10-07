import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { FaUserClock } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const PendingUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch pending users from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/users/pending')  // Fetching from backend
      .then((response) => {
        setPendingUsers(response.data); // Set the fetched users in state
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
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

  const handleVerifyUser = () => {
    if (selectedUser) {
      axios.put(`http://localhost:5000/api/users/${selectedUser._id}/verify`)
        .then(() => {
          setPendingUsers(pendingUsers.map(user =>
            user._id === selectedUser._id ? { ...user, account_status: 'verified' } : user
          ));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error verifying user:', error);
        });
    }
  };

  const handleRejectUser = () => {
    if (selectedUser) {
      axios.put(`http://localhost:5000/api/users/${selectedUser._id}/reject`)
        .then(() => {
          setPendingUsers(pendingUsers.map(user =>
            user._id === selectedUser._id ? { ...user, account_status: 'rejected' } : user
          ));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error rejecting user:', error);
        });
    }
  };

  return (
    <div className="content-container pending-user">
      <h2>Pending Users</h2>
      <div className="user-list">
        {pendingUsers.map((user) => (
          <Card key={user._id} className="user-card">
            <Card.Body>
              <FaUserClock className="icon" />
              <Card.Title>{user.fname} {user.lname}</Card.Title>
              <Card.Text>Email: {user.email}</Card.Text>
              <Card.Text>Account Status: {user.account_status}</Card.Text>
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
              <p>Account Status: {selectedUser.account_status}</p>

              {/* Conditional rendering for valid ID placeholder */}
              {selectedUser.validID ? (
                <p><strong>Valid ID:</strong> {selectedUser.validID}</p>
              ) : (
                <p><strong>Valid ID:</strong> <em>No ID provided</em></p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="success" onClick={handleVerifyUser}>Verify</Button>
          <Button variant="danger" onClick={handleRejectUser}>Reject</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingUser;
