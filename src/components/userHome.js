import React, { useState, useEffect } from "react";
import "../App.css"; // Import CSS file for styling

export default function AdminDashboard({ userData }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentView, setCurrentView] = useState('users');
  // Function to fetch user data
  const fetchUsers = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error));
  };

  // Function to change password for a user
  const changePassword = () => {
    if (!selectedUser || !newPassword) return;

    fetch(`/api/user/${selectedUser.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newPassword })
    })
    .then(response => {
      if (response.ok) {
        alert("Password changed successfully!");
        setNewPassword('');
      } else {
        alert("Failed to change password");
      }
    })
    .catch(error => console.log(error));
  };

  // Function to log out
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
    {/* Navbar */}
    <nav className="navbar">
      <div className="navbar-brand">Admin Management</div>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </nav>
  
    {/* Sidebar */}
    <aside className="sidebar">
      <ul>
      <li onClick={() => setCurrentView('users')}>User Management</li>
          <li onClick={() => setCurrentView('employees')}>Employees</li> {/* New menu item */}
          <li onClick={() => setCurrentView('changePassword')}>Change Password</li>
        {/* Add more menu items as needed */}
      </ul>
    </aside>
  
    {/* Main Content */}
    <main className="main-content">
      {currentView === 'users' && (
        <div className="user-management">
          <h1>Welcome, {userData.fname}</h1>
        
          <h2>User Management</h2>
          <div>
            {/* Display Users */}
            <h3>Users</h3>
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
       {currentView === 'employees' && (
    <div className="employees-details">
      <h1>Welcome, {userData.fname}</h1>
      <h2>Employees Details</h2>
      <div className="employee-list">
        {users.slice(0, 4).map(employee => (
          <div key={employee.id} className="employee">
            <h3>{employee.username}</h3>
            <p>Email: {employee.email}</p>
            <p>ID: {employee.id}</p> {/* Additional detail: ID */}
            <p>Salary: {employee.salary}</p> {/* Additional detail: Salary */}
            <p>Place: {employee.place}</p> {/* Additional detail: Place */}
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  )}

  
      {currentView === 'changePassword' && (
        <div className="change-password">
          <h1>Welcome, {userData.fname}</h1>
          <h2>Change Password</h2>
          <select onChange={(e) => setSelectedUser(users.find(user => user.id === parseInt(e.target.value)))}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button onClick={changePassword}>Change Password</button>
        </div>
      )}
    </main>
  </div>
  
  );
}
