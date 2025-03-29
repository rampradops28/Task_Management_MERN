import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import './styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="landing-page">
      <div className="content-wrapper">
        <div className="logo-container">
          <ClipboardList size={48} className="logo" />
        </div>
        <h1 className="main-title">Task Management</h1>
        <h2 className="landing-title">Choose Your Role</h2>
        <p className="landing-description">
          Select whether you want to access the application as an Admin or as a User. 
          Choose the appropriate role and get started with efficient task management!
        </p>
        <div className="button-container">
          <button 
            onClick={() => handleNavigation('login-admin')} 
            className="landing-button admin-btn">
            Admin Access
          </button>
          <button 
            onClick={() => handleNavigation('login-user')} 
            className="landing-button user-btn">
            User Access
          </button>
        </div>
      </div>

      <div className="particles">
        {[...Array(15)].map((_, index) => (
          <div key={index} className={`particle particle-${index + 1}`}></div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
