import { Button, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import $api, { $url } from '@/request/paths';
import { recover as R } from '@/langs/auth.langs';
import { validstr } from '@/langs/common.langs';
import { useState } from 'react';
import { InputBox } from '@/components/InputForm';
import ModalAuthCodeCheck from './ModalAuthCodeCheck';
import api from '@/request/apis';
import useAlert from '@/hooks/useAlert';
import { valid } from '@/utils/validation';

const RecoverPawsword = () => {
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState<string | null>(null);
	const { showAlertError } = useAlert();

	const onCloseModal = (isOk: boolean) => {
		if (isOk) {
			console.log(isOk);
			setStep(2);
		} else {
			setStep(1);
		}

		setEmail(null);
	};

	const initialValues = {
		email: '',
	};

	const validationSchema = Yup.object().shape({
		email: valid.email,
	});

	// 이메일 인증 버튼 클릭
	const onSubmit = (fields: { email: string }) => {
		// 이메일 인증 요청
		api
			.post($api.auth.code.request, fields)
			.then((data) => {
				if (data) {
					console.log('[bhcho]', { fields, data });
					// 인증 코드 확인 모달
					setEmail(fields.email);
				} else {
					// TODO[SERVER] : 서버 처리되면 메시지 수정
					showAlertError('등록된 이메일이 아닙니다(테스트 : test@test.com).');
				}
			})
			.catch((err) => console.error(err)); //!! ErrorBoundary 처리
	};

	return (
		<>
			<Col lg='3' className='recover-box'>
				<h4 className='mb-4 fw-bold text-center'>{R.title.password}</h4>

				{step === 1 && (
					<>
						<p className='mb-2 fs-5'>{R.label.password}</p>

						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
							component={({
								errors,
								touched,
							}: {
								errors: FormikErrors<{ email: string }>;
								touched: FormikTouched<{
									email: boolean;
								}>;
							}) => (
								<Form className='mt-3'>
									<InputBox
										name='email'
										type='email'
										placeholder={R.placeholder.email}
										errors={errors.email}
										touched={touched.email}
									/>

									<Button
										type='submit'
										className='mt-5 w-100'
										color='info'
										size='md'
									>
										{R.button.email_check}
									</Button>
								</Form>
							)}
						/>
					</>
				)}

				{step === 2 && <ResetPassword />}
			</Col>

			{email && <ModalAuthCodeCheck email={email} onClose={onCloseModal} />}
		</>
	);
};

export default RecoverPawsword;

export const ResetPassword = () => {
	const navigate = useNavigate();
	const { showAlertSuccess, showAlertError } = useAlert();

	const initialValues = {
		password: '',
		passwordCheck: '',
	};

	const validationSchema = Yup.object().shape({
		password: valid.password(),
		passwordCheck: valid.passwordCheck('password'),
	});

	const onSubmit = (fields: { password: string }) => {
		// 이메일 인증 요청
		api
			.post($api.auth.recover.password, fields)
			.then((data) => {
				if (data) {
					console.log('[bhcho]', { fields, data });
					showAlertSuccess(R.alert.success);
					navigate($url.login.root);
				} else {
					// TODO[SERVER] : 서버 처리되면 메시지 수정
					showAlertError('오류!!!!(테스트: 1234qwer)');
				}
			})
			.catch((err) => console.error(err)); //!! ErrorBoundary 처리
	};

	return (
		<>
			<Row>
				<Col lg='9' className='m-auto mt-4'>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
						component={({
							errors,
							touched,
						}: {
							errors: FormikErrors<{ password: string; passwordCheck: string }>;
							touched: FormikTouched<{
								password: boolean;
								passwordCheck: boolean;
							}>;
						}) => (
							<Form className='mt-3'>
								<InputBox
									name='password'
									type='password'
									placeholder={R.placeholder.password_new}
									errors={errors.password}
									touched={touched.password}
								/>

								<InputBox
									name='passwordCheck'
									type='password'
									className='mt-4'
									placeholder={R.placeholder.password_check}
									errors={errors.passwordCheck}
									touched={touched.passwordCheck}
								/>

								<Button
									type='submit'
									className='mt-5 w-100'
									color='info'
									size='md'
								>
									{R.button.ok}
								</Button>
							</Form>
						)}
					/>
				</Col>
			</Row>
		</>
	);
};
