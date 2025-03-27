import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="landing-page">
      <h2 className="landing-title">Choose Your Role</h2>
      <p className="landing-description">
        Select whether you want to access the application as an Admin or as a User. 
        Choose the appropriate role and get started!
      </p>
      <div className="button-container">
        <button 
          onClick={() => handleNavigation('admin')} 
          className="landing-button">
          Admin
        </button>
        <button 
          onClick={() => handleNavigation('user')} 
          className="landing-button">
          User
        </button>
      </div>

      {/* Optional: Add particles if needed */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
    </div>
  );
};

export default LandingPage;
