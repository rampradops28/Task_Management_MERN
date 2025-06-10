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
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
   
  return ( 
    <MDBContainer>
    <MDBTypography tag="h4" className="mt-5 mb-4">Quick Actions</MDBTypography>
      <MDBRow className="g-4">
        <MDBCol md="6" lg="4">
          <Link to="/assign-task" className="text-decoration-none">
            <MDBCard className="h-100 hover-shadow">
              <MDBCardBody className="text-center">
                <MDBIcon fas icon="plus-circle" size="3x" className="text-primary mb-3" />
                <h4>Assign Task</h4>
                <p className="text-muted">Create and assign new tasks to users</p>
                <MDBBadge color="primary" className="position-absolute top-0 end-0 m-2">
                  Quick Assign
                </MDBBadge>
              </MDBCardBody>
            </MDBCard>
          </Link>
        </MDBCol> 

        <MDBCol md="6" lg="4">
          <Link to="/assigned-tasks" className="text-decoration-none">
            <MDBCard className="h-100 hover-shadow">
              <MDBCardBody className="text-center">
                <MDBIcon fas icon="list-check" size="3x" className="text-info mb-3" />
                <h4>View Tasks</h4>
                <p className="text-muted">View and manage all assigned tasks</p>
                <MDBBadge color="info" className="position-absolute top-0 end-0 m-2">
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