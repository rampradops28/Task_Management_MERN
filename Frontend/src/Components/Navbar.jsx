import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarBrand,
  MDBCollapse,
  MDBBtn
} from 'mdb-react-ui-kit';

import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Components/styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Handle body scroll
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.usertype === 'admin' || user?.role === 'admin';
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  if (!user) return null;

  return (
    <>
      <div className={`menu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)} />
      <MDBNavbar expand='lg' dark fixed='top' className='navbar-custom'>
        <MDBContainer fluid>
          <MDBNavbarBrand 
            tag={Link} 
            to={isAdmin ? '/admin-dashboard' : '/user-dashboard'}
            className="d-flex align-items-center"
          >
            <MDBIcon fas icon="tasks" className="me-2" />
            Task Management
          </MDBNavbarBrand>

          <MDBIcon
            fas
            icon={isMenuOpen ? 'times' : 'bars'}
            size="lg"
            className="hamburger-icon"
            onClick={toggleMenu}
            role="button"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          />

          <MDBCollapse show={isMenuOpen} navbar className={isMenuOpen ? 'show' : ''}>
            <div className="nav-wrapper">
              <MDBNavbarNav className='main-nav'>
                {/* Admin Navigation Links */}
                {isAdmin && (
                  <>
                    <MDBNavbarItem>
                      <MDBNavbarLink 
                        tag={Link} 
                        to='/admin-dashboard'
                        className={`nav-link-custom ${isActive('/admin-dashboard')}`}
                        onClick={handleLinkClick}
                      >
                        <MDBIcon fas icon="chart-line" className="me-2" />
                        Dashboard
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink 
                        tag={Link} 
                        to='/manage-tasks'
                        className={`nav-link-custom ${isActive('/manage-tasks')}`}
                        onClick={handleLinkClick}
                      >
                        <MDBIcon fas icon="tasks" className="me-2" />
                        Tasks
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                  </>
                )}

                {/* User Navigation Links */}
                {!isAdmin && (
                  <>
                    <MDBNavbarItem>
                      <MDBNavbarLink 
                        tag={Link} 
                        to='/user-dashboard'
                        className={`nav-link-custom ${isActive('/user-dashboard')}`}
                        onClick={handleLinkClick}
                      >
                        <MDBIcon fas icon="home" className="me-2" />
                        Dashboard
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink 
                        tag={Link} 
                        to='/my-tasks'
                        className={`nav-link-custom ${isActive('/my-tasks')}`}
                        onClick={handleLinkClick}
                      >
                        <MDBIcon fas icon="clipboard-list" className="me-2" />
                        My Tasks
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink 
                        tag={Link} 
                        to='/task-history'
                        className={`nav-link-custom ${isActive('/task-history')}`}
                        onClick={handleLinkClick}
                      >
                        <MDBIcon fas icon="history" className="me-2" />
                        Task History
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                  </>
                )}
              </MDBNavbarNav>

              {/* Right-aligned items */}
              <MDBNavbarNav className='right-nav'>
                {/* Profile */}
                <MDBNavbarItem>
                  <MDBNavbarLink 
                    tag={Link} 
                    to={isAdmin ? '/admin-profile' : '/user-profile'}
                    className={`nav-link-custom ${isActive('/profile')}`}
                    onClick={handleLinkClick}
                  >
                    <MDBIcon fas icon="user-circle" className="me-2" />
                    Profile
                  </MDBNavbarLink>
                </MDBNavbarItem>

                {/* Logout */}
                <MDBNavbarItem>
                  <MDBBtn 
                    onClick={handleLogout}
                    className='logout-btn'
                  >
                    <MDBIcon fas icon="sign-out-alt" className="me-2" />
                    Logout
                  </MDBBtn>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </div>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
};

export default Navbar;
