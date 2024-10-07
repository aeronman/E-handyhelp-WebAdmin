import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const VerifiedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [verifiedHandymen, setVerifiedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch verified handymen from the backend
  useEffect(() => {
    const fetchVerifiedHandymen = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/handymen/verified'); // Fetching from backend
        setVerifiedHandymen(response.data); // Set the fetched handymen in state
      } catch (error) {
        console.error('Error fetching verified handymen:', error);
      }
    };

    fetchVerifiedHandymen();
  }, []);

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  // Filter verified handymen based on search term
  const filteredHandymen = verifiedHandymen.filter(handyman =>
    `${handyman.fname} ${handyman.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Name',
      selector: row => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: 'Account Status',
      selector: row => row.accounts_status || 'Verified Handyman',
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
    <div className="content-container verified-handyman">
      <h2>Verified Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredHandymen} // Use the filtered handymen
        pagination
        highlightOnHover
        striped
        responsive
      />

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
