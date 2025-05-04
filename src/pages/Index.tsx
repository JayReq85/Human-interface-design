
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';
import Navbar from '../components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Welcome />
    </>
  );
};

export default Index;
