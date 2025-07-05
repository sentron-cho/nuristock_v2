import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '../styles/stitches.config';
import Flex from '../features/Flex';
import clsx from 'clsx';

export interface SelectType {
  value: string;
  label: string;
}

// === Styled Components ===
const HeaderContainer = styled(Flex, {
  position: 'sticky',
  top: 0,
  left: 0,
  height: '60px',
  backgroundColor: '$gray900',
  color: '$white',
  zIndex: 1000,

  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'space-between',
  // padding: '0 1.5rem',
  // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

const Nav = styled('nav', {
  display: 'flex',
  gap: '$20',

  '@sm': {
    display: 'none',
  },
});

const NavItem = styled(Link, {
  fontSize: '1rem',
  color: 'white',
  textDecoration: 'none',
  transition: 'color 0.2s',

  '&:hover, &.active': {
    color: '$warning',
  },
});

const Hamburger = styled('button', {
  display: 'none',
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '1.5rem',
  cursor: 'pointer',

  '@sm': {
    display: 'block',
  },
});

const MobileMenu = styled('div', {
  position: 'fixed',
  top: '60px',
  left: 0,
  width: '100vw',
  backgroundColor: '$gray900',
  // display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  gap: '1rem',

  '@sm': {
    display: 'flex',
  },
});

// === Component ===
const Header: React.FC = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // ✅ 윈도우 리사이즈 시 메뉴 닫기
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 640 && isOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const menu = useMemo(() => {
    return [
      { value: '/', label: '메인' },
      { value: '/search', label: '종목검색' },
      { value: '/profit', label: '투자손익' },
      { value: '/value', label: '가치투자' },
    ];
  }, []);

  return (
    <>
      <HeaderContainer justify={'center'} width={'100vw'}>
        <Nav>
          {menu?.map((a) => (
            <NavItem to={a.value} className={clsx({ active: a.value === pathname })}>
              {a.label}
            </NavItem>
          ))}
        </Nav>
        <Hamburger onClick={toggleMenu}>☰</Hamburger>
      </HeaderContainer>

      {isOpen && (
        <MobileMenu>
          {menu?.map((a) => (
            <NavItem to={a.value} className={clsx({ active: a.value === pathname })} onClick={closeMenu}>
              {a.label}
            </NavItem>
          ))}
        </MobileMenu>
      )}
    </>
  );
};

export default Header;
