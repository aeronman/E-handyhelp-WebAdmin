import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaUserTimes } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const RejectedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch rejected users from the backend
  useEffect(() => {
    const fetchRejectedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/rejected');
        setRejectedUsers(response.data);
      } catch (error) {
        console.error('Error fetching rejected users:', error);
      }
    };

    fetchRejectedUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Filter rejected users based on search term
  const filteredUsers = rejectedUsers.filter(user =>
    `${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Name',
      selector: row => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Account Status',
      selector: row => row.accounts_status,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <Button variant="primary" onClick={() => handleOpenModal(row)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="content-container rejected-user">
      <h2>Rejected Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredUsers} // Use the filtered users
        pagination
        highlightOnHover
        striped
        responsive
      />

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
