import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/ehlogo.png'; // Adjust the path as necessary
import './styles.css';

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="E-handyhelp Logo" className="sidebar-logo" />
                <h3 className="sidebar-title">E-handyhelp</h3>
            </div>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/view-reports">View Reports</Link></li>
                <li className="dropdown">
                    <a href="#">Handyman</a>
                    <div className="dropdown-content">
                        <Link to="/handyman/pending">Pending Handyman</Link>
                        <Link to="/handyman/verified">Verified Handyman</Link>
                        <Link to="/handyman/rejected">Rejected Handyman</Link>
                        <Link to="/handyman/suspended">Suspended Handyman</Link>
                    </div>
                </li>
                <li className="dropdown">
                    <a href="#">Users</a>
                    <div className="dropdown-content">
                        <Link to="/users/pending">Pending Users</Link>
                        <Link to="/users/verified">Verified Users</Link>
                        <Link to="/users/rejected">Rejected Users</Link>
                        <Link to="/users/suspended">Suspended Users</Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default AdminSidebar;
