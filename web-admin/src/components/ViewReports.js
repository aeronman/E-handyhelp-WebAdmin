import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import './reportstyles.css';

const ViewReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchReports(); // Fetch reports on initial load
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reports');
            // Filter reports to only include those with status 'pending'
            const pendingReports = response.data.filter(report => report.status === 'pending');
            setReports(pendingReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleShowModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReport(null);
    };

    const handleSuspendHandyman = async (handymanId, reportId) => {
        try {
            // Suspend the handyman
            const response = await fetch(`http://localhost:5000/api/handymen/${handymanId}/suspend`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update the report status to completed
            await axios.put(`http://localhost:5000/api/reports/${reportId}`, {
                status: 'completed',
            });

            alert('Handyman suspended successfully and report status updated to completed.');
            fetchReports(); // Refresh the reports
        } catch (error) {
            console.error('Error suspending handyman:', error);
        }
    };

    return (
        <div className="view-reports-container">
            <h2 className="view-reports-title">Pending Reports</h2>
            <div className="reports-list">
                {reports.map((report, index) => (
                    <Card key={index} className="report-card">
                        <Card.Body>
                            <Card.Title>{report?.reportReason || 'No Reason Provided'}</Card.Title>
                            <Card.Text>
                                <strong>Reported By:</strong> {report?.userId?.fname || 'N/A'} {report?.userId?.lname || ''}<br />
                                <strong>Handyman:</strong> {report?.handymanId?.fname || 'N/A'} {report?.handymanId?.lname || ''}
                            </Card.Text>
                            <Button variant="primary" onClick={() => handleShowModal(report)}>
                                View Details
                            </Button>
                            <Button variant="danger" onClick={() => handleSuspendHandyman(report?.handymanId?._id, report?._id)}>
                                Suspend Handyman
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {selectedReport && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg"> {/* Optional: Add size prop for larger modal */}
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedReport?.reportReason || 'No Reason Provided'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Description:</strong> {selectedReport?.additionalInfo?.workDescription || 'N/A'}</p>
                        <p><strong>Reported By:</strong> {selectedReport?.userId?.fname || 'N/A'} {selectedReport?.userId?.lname || ''}</p>
                        <p><strong>Date Reported:</strong> {new Date(selectedReport?.additionalInfo?.dateReported).toLocaleString() || 'N/A'}</p>
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
