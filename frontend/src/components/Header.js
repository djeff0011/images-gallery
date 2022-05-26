import React from 'react';
import { ReactComponent as Logo } from '../images/logo.svg';

import { Navbar, Container } from 'react-bootstrap';
const navebarStyle = {
   backgroundColor: '#eeeeee',
};

const Header = ({ title }) => {
  return (
    <Navbar style={navebarStyle} variant="light">
      <Container>
        <Logo alt={title} style={{ maxWidth: '12rem', maxHeight: '2rem' }}/>
      </Container>
    </Navbar>
  );
};

export default Header;
