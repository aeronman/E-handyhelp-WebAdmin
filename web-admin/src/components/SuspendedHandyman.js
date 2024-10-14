import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './styles.css';

const SuspendedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLift, setShowConfirmLift] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [suspendedHandymen, setSuspendedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Fetch suspended handymen from the backend
  useEffect(() => {
    const fetchSuspendedHandymen = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/handymen/suspended');
        setSuspendedHandymen(response.data);
      } catch (error) {
        console.error('Error fetching suspended handymen:', error);
      }
    };

    fetchSuspendedHandymen();
  }, []);

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmLift = () => {
    setShowConfirmLift(true);
  };

  const handleDeleteHandyman = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/handymen/${selectedHandyman.id}`);
      setSuspendedHandymen(suspendedHandymen.filter(h => h.id !== selectedHandyman.id));
      setAlert({ type: 'success', message: 'Handyman deleted successfully.' });
    } catch (error) {
      console.error('Error deleting handyman:', error);
      setAlert({ type: 'danger', message: 'Failed to delete handyman.' });
    } finally {
      setShowConfirmDelete(false);
      setSelectedHandyman(null);
    }
  };

  const handleLiftSuspension = async () => {
    try {
      await axios.put(`http://localhost:5000/api/handymen/lift-suspension/${selectedHandyman.id}`, {
        accounts_status: 'verified',
      });
      setSuspendedHandymen(suspendedHandymen.map(h => 
        h.id === selectedHandyman.id ? { ...h, accounts_status: 'verified' } : h
      ));
      setAlert({ type: 'success', message: 'Suspension lifted successfully.' });
    } catch (error) {
      console.error('Error lifting suspension:', error);
      setAlert({ type: 'danger', message: 'Failed to lift suspension.' });
    } finally {
      setShowConfirmLift(false);
      setSelectedHandyman(null);
    }
  };

  // Filter suspended handymen based on search term
  const filteredHandymen = suspendedHandymen.filter(handyman =>
    `${handyman.fname} ${handyman.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Name',
      selector: row => `${row.fname} ${row.lname}`,
      sortable: true,
      width: '150px', // Adjust width as needed
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      width: '200px', // Adjust width as needed
    },
    {
      name: 'Account Status',
      selector: row => row.accounts_status || 'Suspended',
      sortable: true,
      width: '150px', // Adjust width as needed
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="table-action-buttons">
          <Button variant="success" onClick={() => { setSelectedHandyman(row); handleConfirmLift(); }}>
            Lift Suspension
          </Button>
          <Button variant="danger" onClick={() => { setSelectedHandyman(row); handleConfirmDelete(); }}>
            Delete
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal(row)}>
            View Details
          </Button>
        </div>
      ),
      width: '200px', // Adjust width to allow buttons to fit
    },
  ];
  
  return (
    <div className="content-container suspended-handyman">
      <h2>Suspended Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredHandymen}
        pagination
        highlightOnHover
        striped
        responsive
      />

      {/* Alert for success or error messages */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

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

      {/* Confirmation Modal for Delete */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedHandyman?.fname} {selectedHandyman?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteHandyman}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Lifting Suspension */}
      <Modal show={showConfirmLift} onHide={() => setShowConfirmLift(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Lift Suspension</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to lift the suspension for {selectedHandyman?.fname} {selectedHandyman?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmLift(false)}>Cancel</Button>
          <Button variant="success" onClick={handleLiftSuspension}>Lift Suspension</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuspendedHandyman;
