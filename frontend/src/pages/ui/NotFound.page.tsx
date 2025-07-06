import { styled } from '@styles/stitches.config';

const Container = styled('div', {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  textAlign: 'center',
});

const Title = styled('h1', {
  fontSize: '4rem',
  color: '$gray900',
});

const Message = styled('p', {
  fontSize: '1.25rem',
  color: '$gray600',
});

const NotFound = () => {
  return (
    <Container>
      <Title>404</Title>
      <Message>페이지를 찾을 수 없습니다.</Message>
    </Container>
  );
};

NotFound.displayName = 'NotFound';
export default NotFound;
