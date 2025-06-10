import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="landing-page-wrapper">
      <div className="landing-page">
        <div className="particles">
          {[...Array(15)].map((_, index) => (
            <div key={index} className={`particle particle-${index + 1}`}></div>
          ))}
        </div>
        
        <Container className="d-flex align-items-center justify-content-center h-100">
          <Row className="w-100 justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <div className="content-wrapper">
                <div className="logo-container">
                  <ClipboardList size={48} className="logo" />
                </div>
                
                <h1 className="main-title">
                  Task Management
                  <span className="highlight-bar"></span>
                </h1>
                
                <h2 className="landing-title">Choose Your Role</h2>
                
                <p className="landing-description">
                  Select whether you want to access the application as an Admin or as a User. 
                  Choose the appropriate role and get started with efficient task management!
                </p>
                
                <div className="button-container">
                  <Button 
                    onClick={() => handleNavigation('login-admin')} 
                    className="landing-button admin-btn"
                    size="lg"
                  >
                    <span className="button-content">
                      <span className="button-text">Admin Access</span>
                      <span className="button-icon">→</span>
                    </span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleNavigation('login-user')} 
                    className="landing-button user-btn"
                    size="lg"
                  >
                    <span className="button-content">
                      <span className="button-text">User Access</span>
                      <span className="button-icon">→</span>
                    </span>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;
