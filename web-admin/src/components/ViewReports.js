import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import './styles.css';

const ViewReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/reports') // Fetching from backend
      .then((response) => {
        setReports(response.data); // Set the fetched users in state
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
      });
    }, []);

    const handleShowModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReport(null);
    };

    const handleSuspendHandyman = async (handymanId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/handymen/${handymanId}/suspend`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Handyman suspended successfully');
        } catch (error) {
            console.error('Error suspending handyman:', error);
        }
    };

    return (
        <div className="view-reports-container">
            <h2 className="view-reports-title">Reports</h2>
            <div className="reports-list">
                {reports.map((report, index) => (
                    <Card key={index} className="report-card">
                        <Card.Body>
                            <Card.Title>{report.reportReason}</Card.Title>
                            <Card.Text>
                                <strong>Reported By:</strong> {report.userId.fname} {report.userId.lname}<br />
                                <strong>Handyman:</strong> {report.handymanId.fname} {report.handymanId.lname}
                            </Card.Text>
                            <Button variant="primary" onClick={() => handleShowModal(report)}>
                                View Details
                            </Button>
                            <Button variant="danger" onClick={() => handleSuspendHandyman(report.handymanId._id)}>
                                Suspend Handyman
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {selectedReport && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedReport.reportReason}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Description:</strong> {selectedReport.additionalInfo.workDescription}</p>
                        <p><strong>Reported By:</strong> {selectedReport.userId.fname} {selectedReport.userId.lname}</p>
                        <p><strong>Date Reported:</strong> {new Date(selectedReport.additionalInfo.dateReported).toLocaleString()}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ViewReports;
