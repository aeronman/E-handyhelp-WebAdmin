import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './styles.css';

const RejectedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [rejectedHandymen, setRejectedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch rejected handymen from the backend
  useEffect(() => {
    const fetchRejectedHandymen = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/handymen/rejected');
        setRejectedHandymen(response.data);
      } catch (error) {
        console.error('Error fetching rejected handymen:', error);
      }
    };

    fetchRejectedHandymen();
  }, []);

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  const filteredHandymen = rejectedHandymen.filter(handyman =>
    `${handyman.fname} ${handyman.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
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
      name: 'Status',
      selector: row => row.accounts_status || 'Rejected',
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
    <div className="content-container rejected-handyman">
      <h2>Rejected Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredHandymen} // Use filtered data for display
        pagination
        highlightOnHover
        striped
        responsive
        searchable
      />

      {/* Modal for handyman details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Handyman Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHandyman && (
            <>
              <h5>
                Name: {selectedHandyman.fname} {selectedHandyman.lname}
              </h5>
              <p>Email: {selectedHandyman.email}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>Specialization: {selectedHandyman.specialization.join(', ')}</p>
              <p>Account Status: {selectedHandyman.accounts_status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RejectedHandyman;
