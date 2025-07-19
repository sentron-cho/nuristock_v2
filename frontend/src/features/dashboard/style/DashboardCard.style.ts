import Card from '@mui/material/Card';
import { styled } from '@styles/stitches.config';

export const StyledCard = styled(Card, {
  width: '33.33333%',
  height: '280px',
  boxShadow: 'unset !important',
  padding: '$4',

  '&.card': {
    backgroundColor: 'transparent',
    cursor: 'pointer',

    '.box': {
      backgroundColor: '$white',
      borderRadius: '$sm',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: 'var(--Paper-shadow);',
      overflow: 'hidden',
      height: '100%',
      padding: '$4',

      '.head, .foot, .body': {
        padding: '0 $4',
      },

      '.trade-info, .keep-info': {
        '&.keep-info': {
          borderTop: '1px solid $gray300',
        },

        padding: '8px',
      },

      '.head': {
        height: '40px',
        borderBottom: '1px solid $gray300',
      },

      '.body': {
        borderBottom: '1px solid $gray300',
        overflow: 'hidden',
        flex: 1,

        '.b-item': {
          borderTop: '1px solid $gray300',
          paddingTop: '$10',
        },
      },

      '.foot': {
        height: '40px',

        '.naver, .daum': {
          '&.naver': {
            backgroundColor: '#00c73c',
          },
          '&.daum': {
            backgroundColor: '#fcce00',
            color: '$black',
          },
        },

        '.sise': {
          textAlign: 'right',

          '.time': {
            color: '$gray600',
          },

          '.icon': {
            position: 'relative',
            marginLeft: '24px',

            svg: {
              left: '-20px',
              position: 'absolute',
              opacity: '0.8',
            },
          },
        },
      },

      '.plus': {
        color: '$plus',
      },

      '.minus': {
        color: '$minus',
      },
    },

    '&.active': {
      '.box': {
        borderColor: '$gray700',
      },
    },
  },

  '@lg': {
    width: '50%',
  },
  '@md': {
    width: '100%',
  },
});