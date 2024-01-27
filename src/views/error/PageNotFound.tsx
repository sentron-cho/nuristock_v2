import { $url } from '@/request/paths';
import { styled } from '@stitches/react';
import { useNavigate } from 'react-router-dom';
import errorBg from '@/assets/images/error-bg.jpg';
import { Button } from 'reactstrap';

const StyledPageNotFound = styled('div', {
	width: '100vw',
	height: '100vh',
});

const PageNotFound = () => {
	const navigate = useNavigate();

	return (
		<StyledPageNotFound
			className='page-notfound'
			style={{
				background: `url(${errorBg}) no-repeat bottom center #fff`,
			}}
		>
			<div className='d-flex align-items-center justify-content-center h-100'>
				<div className='text-center'>
					<h1 className='fw-bold fs-1'>404</h1>
					<h4 className='mt-4 fs-2'>PAGE NOT FOUND!</h4>
					<Button className='btn btn-danger mt-5' onClick={() => navigate(-2)}>
						뒤로 가기
					</Button>
				</div>
			</div>
		</StyledPageNotFound>
	);
};

export default PageNotFound;
