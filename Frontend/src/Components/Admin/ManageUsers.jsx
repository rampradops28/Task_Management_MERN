import React from 'react';
import { 
  MDBIcon,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBTypography, 
  MDBRow,
  MDBCol,
  MDBBtn
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';

const cardStyles = {
  assign: {
    border: '3px solid #4F8A8B', // teal
    borderRadius: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 12px rgba(79,138,139,0.08)'
  },
  view: {
    border: '3px solid #F9B208', // gold
    borderRadius: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 12px rgba(249,178,8,0.08)'
  }
};

const ManageUsers = () => {
  const navigate = useNavigate();

  return (
    <MDBContainer className="py-5">
       

      <MDBTypography tag="h2" className="mb-4 text-center fw-bold">
        Manage Users
      </MDBTypography>
      <MDBTypography tag="h5" className="mb-5 text-center text-muted">
        Quick Actions for Admins
      </MDBTypography>

      <MDBRow className="g-4 justify-content-center">
        <MDBCol xs="12" md="6" lg="5" xl="4">
          <Link to="/assign-task" className="text-decoration-none">
            <MDBCard 
              className="h-100 border-0"
              style={cardStyles.assign}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(79,138,139,0.18)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = cardStyles.assign.boxShadow}
            >
              <MDBCardBody className="text-center py-5">
                <MDBIcon fas icon="plus-circle" size="3x" className="text-primary mb-3" />
                <h4 className="fw-bold mb-2">Assign Task</h4>
                <p className="text-muted mb-4">Create and assign new tasks to users</p>
                <MDBBadge color="primary" pill className="px-3 py-2 fs-6">
                  Quick Assign
                </MDBBadge>
              </MDBCardBody>
            </MDBCard>
          </Link>
        </MDBCol> 

        <MDBCol xs="12" md="6" lg="5" xl="4">
          <Link to="/assigned-tasks" className="text-decoration-none">
            <MDBCard 
              className="h-100 border-0"
              style={cardStyles.view}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(249,178,8,0.18)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = cardStyles.view.boxShadow}
            >
              <MDBCardBody className="text-center py-5">
                <MDBIcon fas icon="list-check" size="3x" className="text-warning mb-3" />
                <h4 className="fw-bold mb-2">View Tasks</h4>
                <p className="text-muted mb-4">View and manage all assigned tasks</p>
                <MDBBadge color="warning" pill className="px-3 py-2 fs-6">
                  Assigned Tasks
                </MDBBadge>
              </MDBCardBody>
            </MDBCard>
          </Link>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ManageUsers;