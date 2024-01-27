import { Button, Col } from 'reactstrap';
import { Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { register as R } from '@/langs/auth.langs';
import { InputBox } from '@/components/InputForm';
import { IMembershipCheck } from '@/types/interfaces';
import { valid } from '@/utils/validation';

interface IValue extends IMembershipCheck {}
interface IError extends IMembershipCheck {}
interface ITouched {
	userName: boolean;
	email: boolean;
	password: boolean;
	passwordCheck: boolean;
}

const MamberShip = ({ onClick }: { onClick: (values: IValue) => void }) => {
	const initialValues = {
		userName: '',
		email: '',
		password: '',
		passwordCheck: '',
	};

	const validationSchema = Yup.object().shape({
		userName: valid.userName,
		email: valid.email,
		password: valid.password(),
		passwordCheck: valid.passwordCheck('password'),
	});

	return (
		<>
			<Col lg='3' className='register-box'>
				<h4 className='mb-4 fw-bold text-center'>{R.title.membership}</h4>
				<small className='mb-5 d-block text-center'>{R.label.membership}</small>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onClick}
					component={({
						errors,
						touched,
					}: {
						errors: FormikErrors<IError>;
						touched: FormikTouched<ITouched>;
					}) => {
						const isDisabled = () => {
							const isErrorEmpty =
								Object.keys(errors).length === 0 &&
								errors.constructor === Object;
							const isAllTouched =
								Boolean(touched.userName) &&
								Boolean(touched.email) &&
								Boolean(touched.password);
							// && Boolean(touched.passwordCheck);

							return !(isErrorEmpty && isAllTouched);
						};

						return (
							<Form>
								<InputBox
									name='userName'
									placeholder={R.placeholder.name}
									errors={errors.userName}
									touched={touched.userName}
								/>

								<InputBox
									name='email'
									placeholder={R.placeholder.email}
									errors={errors.email}
									touched={touched.email}
								/>

								<InputBox
									name='password'
									type='password'
									placeholder={R.placeholder.password}
									errors={errors.password}
									touched={touched.password}
								/>

								<InputBox
									name='passwordCheck'
									type='password'
									placeholder={R.placeholder.password_check}
									errors={errors.passwordCheck}
									touched={touched.passwordCheck}
								/>

								<Button
									type='submit'
									className='mt-5 w-100'
									color='info'
									size='md'
									disabled={isDisabled()}
								>
									{R.button.next}
								</Button>
							</Form>
						);
					}}
				/>
			</Col>
		</>
	);
};

export default MamberShip;
