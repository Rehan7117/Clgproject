import React, { useEffect, useState } from 'react';
import './adminQueries.css';

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/get-queries'); // Fetch queries from backend
        if (!response.ok) throw new Error('Failed to fetch queries');
        const data = await response.json();
        setQueries(data);
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    fetchQueries();
  }, []);

  return (
    <div className="admin-queries">
      <h2>Submitted Queries</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query, index) => (
            <tr key={index}>
              <td>{query.name}</td>
              <td>{query.email}</td>
              <td>{query.phone}</td>
              <td>{query.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminQueries;
