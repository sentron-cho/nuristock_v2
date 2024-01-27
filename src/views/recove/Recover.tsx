import { Button, Label, FormGroup, Container, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { recover as R } from '@/langs/auth.langs';
import { LeftBg, RightBg } from '@/assets/svg/bg';
import { useState } from 'react';
import RecoverPawsword from './RecoverPassword';

const Recover = () => {
	const [type, setType] = useState<'userid' | 'password'>('password');

	return (
		<div className='login'>
			<LeftBg className='position-absolute left bottom-0' />
			<RightBg className='position-absolute end-0 top' />
			<Container fluid className='h-100'>
				<Row className='justify-content-center align-items-center h-100'>
					{type === 'password' && <RecoverPawsword />}
					{type === 'userid' && <RecoverUserid />}
				</Row>
			</Container>
		</div>
	);
};

export default Recover;

const RecoverUserid = () => {
	return (
		<Col lg='3' className='recover-box'>
			<h4 className='mb-4 fw-bold text-center'>{R.title.password}</h4>
			<p className='mb-2 fs-5'>{R.label.password}</p>

			<Row>
				<Col lg='8' className='m-auto mt-4'>
					<Button type='submit' color='info' block>
						{R.button.email_check}
					</Button>
				</Col>
			</Row>
		</Col>
	);
};

const NewPassword = () => {
	const navigate = useNavigate();

	const initialValues = {
		email: '',
		uname: '',
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Email is invalid').required('Email is required'),
		uname: Yup.string().required('Username is required'),
	});

	return (
		<Col lg='3' className='register-box'>
			<h4 className='mb-4 fw-bold text-center'>{R.title.password}</h4>
			<p className='mb-2 fs-5'>{R.label.password}</p>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={(fields) => {
					//!! Toast Context 처리
					alert(`SUCCESS!! :-)\n\n${JSON.stringify(fields, null, 4)}`);
					navigate('/');
				}}
				component={({ errors, touched }) => (
					<Form className='mt-3'>
						<FormGroup>
							<Label htmlFor='name'>Name</Label>
							<Field
								name='name'
								type='text'
								className={`form-control${
									errors.uname && touched.uname ? ' is-invalid' : ''
								}`}
							/>
							<ErrorMessage
								name='name'
								component='div'
								className='invalid-feedback'
							/>
						</FormGroup>
						<FormGroup>
							<Label htmlFor='email'>Email</Label>
							<Field
								name='email'
								type='text'
								className={`form-control${
									errors.email && touched.email ? ' is-invalid' : ''
								}`}
							/>
							<ErrorMessage
								name='email'
								component='div'
								className='invalid-feedback'
							/>
						</FormGroup>
						<FormGroup>
							<Row>
								<Col lg='8' className='m-auto mt-4'>
									<Button type='submit' color='info' block className='me-2'>
										Reset
									</Button>
								</Col>
							</Row>
						</FormGroup>
					</Form>
				)}
			/>
		</Col>
	);
};
