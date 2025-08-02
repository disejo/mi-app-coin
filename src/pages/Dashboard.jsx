import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Bienvenido, {user.displayName}</p>}
    </div>
  );
};

export default Dashboard;