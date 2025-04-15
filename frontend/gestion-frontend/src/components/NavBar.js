import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-5 fw-bold">
          Sistema Restaurante
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-links" />
        <Navbar.Collapse id="nav-links">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="mx-2">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/finanzas" className="mx-2">Finanzas</Nav.Link>
            <Nav.Link as={Link} to="/nomina" className="mx-2">Nómina</Nav.Link>
            <Nav.Link as={Link} to="/inventario" className="mx-2">Inventario</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
