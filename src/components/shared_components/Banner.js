import React, { useState } from "react";
import styled, { css } from 'styled-components';
import Menu from '../shared_components/Menu.js';

const Container = styled.div``;

// https://freefrontend.com/css-tabs/ 1:28
const StyledBanner = styled.div`
    height: 75px;
    // so we position <Tabs /> relative to this 
    position: relative;
    background-color: #CCDBDC;
    display: flex;
`;

// https://codepen.io/james2doyle/pen/ZpGkqa
const MenuIcon = styled.div`
  position: ${({activate}) => activate ? 'fixed' : 'relative'};
  padding: 1.5rem;
  z-index: 4;

  .menu-toggle {
    position: absolute;
    top: 49%;
    transform: translate(0, -50%);
    height: 26px;
    width: 29px;

    &, &:hover {
      color: #000;
    }
  }

.menu-toggle-bar {
  display: block;
  position: absolute;
  top: 50%;
  margin-top: -1px;
  right: 0;
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background-color: black;
  transition: all 0.3s ease;

  &.menu-toggle-bar--top {
    transform: translate(0, -8px);
  }
  
  &.menu-toggle-bar--middle {
  }
  
  &.menu-toggle-bar--bottom {
    transform: translate(0, 8px);
  }


  ${props => props.activate &&
    css`
      &.menu-toggle-bar--top {
        transform: translate(0, 0) rotate(45deg);
      }

      &.menu-toggle-bar--middle {
        opacity: 0;
      }

      &.menu-toggle-bar--bottom {
        transform: translate(0, 0) rotate(-45deg);
      }
  `
  }

`;

const GrayOutViewPort = styled.div`
    display: ${({ visible }) => visible ? 'block' : 'none'};
    opacity: 0.5; 
    background: #000; 
    width: 100%;
    height: 100%; 
    z-index: 10;
    top: 0; 
    left: 0; 
    position: fixed; 
    z-index: 2;
`;

const Banner = (props) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    
  return (
    <Container>
      <GrayOutViewPort visible={menuIsOpen} />
      <StyledBanner>
        <MenuIcon onClick={() => setMenuIsOpen(!menuIsOpen)} activate={menuIsOpen}>
          <a id="menu-toggle" class="menu-toggle">
            <span class="menu-toggle-bar menu-toggle-bar--top"></span>
            <span class="menu-toggle-bar menu-toggle-bar--middle"></span>
            <span class="menu-toggle-bar menu-toggle-bar--bottom"></span>
          </a>
        </MenuIcon>
      </StyledBanner>
      <Menu open={menuIsOpen} />
    </Container>
  );
}

export default Banner;
