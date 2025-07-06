import { styled } from '@styles/stitches.config';

export const StyledHeader = styled('div', {
  '.header-bar': {
    position: 'sticky',
    top: 0,
    left: 0,
    height: '60px',
    backgroundColor: '$gray900',
    color: '$white',
    zIndex: 1000,

    '.nav': {
      display: 'flex',
      gap: '$20',

      '@sm': {
        display: 'none',
      },
    },

    '.mobile': {
      display: 'none',
      height: '100%',
      width: '100%',

      '@sm': {
        display: 'flex',
      },

      '.title-bar': {
        '.box': {
          cursor: 'pointer',

          '.title': {
            padding: '$4',
            fontSize: '$lg',
          },
        },

        // flex: 1,
        // textAlign: 'center',
        // cursor: 'pointer',
      },

      '.menu-button': {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
      },
    },
  },

  '.link': {
    fontSize: '1rem',
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.2s',

    '&:hover, &.active': {
      color: '$warning',
    },
  },

  '.mobile-menu': {
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '100vw',
    backgroundColor: '$gray900',
    flexDirection: 'column',
    padding: '$16',
    gap: '$16',

    '@sm': {
      display: 'flex',
    },
  },
});