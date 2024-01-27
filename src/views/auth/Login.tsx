import { Button, FormGroup, Container, Row, Col } from 'reactstrap';
import { Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import $api, { $url } from '@/request/paths';
import logo from '@/assets/images/logo.jpg';
import { login as R } from '@/langs/auth.langs';
import { LeftBg, RightBg } from '@/assets/svg/bg';
import { CheckBox, InputBox } from '@/components/InputForm';
import { useEffect, useRef, useState } from 'react';
import useAlert from '@/hooks/useAlert';
import { valid } from '@/utils/validation';
import { ILogin } from '@/types/interfaces';
import Session from '@/store/Session';
import Thumbnail from '@/components/Thumbnail';
import useRequest, { Method, Parser } from '@/hooks/useRequest';

interface IValue extends ILogin {}
interface IError extends ILogin {}

interface ITouched {
	email: boolean;
	// password: boolean;
}

const Login = () => {
	const userinfo = Session.getCheckRegistLogin();
	const [checked, setChecked] = useState<boolean>(!!userinfo);
	const { showAlert, showAlertError } = useAlert();
	const [data, doRequest] = useRequest<Record<string, string>>();
	const refEmail = useRef<HTMLInputElement>(null);
	const refPwd = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = Yup.object().shape(
		userinfo
			? {}
			: {
					email: valid.email,
					// password: valid.password(),
			  }
	);

	useEffect(() => {
		if (data) {
			const { accessToken, refreshToken, accessTokenExpireDate } = data;
			Session.setUserInfo({
				...Parser.userInfo(data.userDetail),
				accessToken,
				refreshToken,
				accessTokenExpireDate,
			} as any);

			if (checked) {
				if (refEmail?.current?.value && refPwd?.current?.value) {
					Session.setCheckRegistLogin({
						email: refEmail?.current?.value as string,
						password: refPwd?.current?.value as string,
					});
				}
			} else {
				Session.removeCheckRegistLogin();
			}

			navigate($url.apps.dashboard);
		}
	}, [data]);

	useEffect(() => {
		if (userinfo) {
			refEmail.current && (refEmail.current.value = userinfo?.email);
			refPwd.current && (refPwd.current.value = userinfo?.password);
		}
	}, []);

	const onSubmit = async (fields: IValue) => {
		const data = userinfo || fields;
		doRequest(Method.POST, $api.auth.login, {
			data: data,
			useLoading: false,
		});
	};

	// TODO 추후 처리 예정
	const onClickGoogle = () => {
		showAlert('구글 서비스!', 'success', 'left', 500);
	};

	// TODO 추후 처리 예정
	const onClickApple = () => {
		showAlert('애플 서비스!', 'fail', 'center', 1000);
	};

	// TODO 추후 처리 예정
	const onClickFacebook = () => {
		showAlertError('페이스북 서비스!', 'right', 5000);
	};

	const onChecked = (isCkecked: boolean) => {
		setChecked(isCkecked);
	};

	return (
		<div className='login'>
			<LeftBg className='position-absolute left bottom-0' />
			<RightBg className='position-absolute end-0 top' />
			<Container fluid className='h-100'>
				<Row className='justify-content-center align-items-center h-100'>
					<Col lg='6' className='login-box mx-5'>
						<Thumbnail src={logo} border={false} alt='logo' />
					</Col>
					<Col lg='6' className='login-box mx-5'>
						<h4 className='mb-4 fw-bold'>{R.title}</h4>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
							component={({
								errors,
								touched,
							}: {
								errors: FormikErrors<IError>;
								touched: FormikTouched<ITouched>;
							}) => (
								<Form>
									<InputBox
										name='email'
										innerRef={refEmail}
										placeholder={R.placeholder.id}
										errors={errors.email}
										touched={touched.email}
									/>

									<InputBox
										name='password'
										innerRef={refPwd}
										type='password'
										placeholder={R.placeholder.password}
										// errors={errors.password}
										// touched={touched.password}
									/>

									<FormGroup className='form-check d-flex' inline>
										<CheckBox
											checked={checked}
											title={R.label.regist_check}
											onChecked={onChecked}
										/>
										<Link
											className='ms-auto text-decoration-none link-info fw-normal'
											to={$url.auth.recover}
										>
											<small>{R.link.recover}</small>
										</Link>
									</FormGroup>

									<h5 className='mt-4 fw-bold text-center'>{R.label.social}</h5>
									<Row className='text-center mt-2 w-100 m-auto'>
										<Col md='12' className='m-auto mt-2'>
											<Button className='mx-1 w-auto' onClick={onClickGoogle}>
												{R.button.google}
											</Button>
											<Button className='mx-1 w-auto' onClick={onClickApple}>
												{R.button.apple}
											</Button>
											<Button className='mx-1 w-auto' onClick={onClickFacebook}>
												{R.button.facebook}
											</Button>
										</Col>
									</Row>
									<Row>
										<Col md='8' className='m-auto mt-4'>
											<Button type='submit' color='info' size='md' block>
												{R.button.login}
											</Button>
										</Col>
									</Row>
									<Row className='mt-3'>
										<Col md='12' className='text-center'>
											<Link
												className='ms-auto text-decoration-none link-info fw-normal'
												to={$url.auth.register}
											>
												<small>{R.link.regist}</small>
											</Link>
										</Col>
									</Row>
								</Form>
							)}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Login;
