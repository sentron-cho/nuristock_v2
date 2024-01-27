import { useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import $api, { $url } from '@/request/paths';
import { LeftBg, RightBg } from '@/assets/svg/bg';
import { useState } from 'react';
import ModalAuthCodeCheck from '@/views/recove/ModalAuthCodeCheck';
import PrivacyAgree from './PrivacyAgree';
import MamberShip from './Membership';
import AdditionalInfo from './AdditionalInfo';
import {
	IMemberAdditionInfo,
	IMembershipCheck,
	IPrivacyAgree,
	IUser,
} from '@/types/interfaces';
import useRequest, { Method, Parser } from '@/hooks/useRequest';
import { UserRole } from '@/types/types';
import Session from '@/store/Session';

const Register = () => {
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [email, setEmail] = useState<string | null>(null);
	const [checks, setChecks] = useState<IPrivacyAgree | null>(null);
	const [userId, setRequest] = useRequest<string>();
	const [, doRequestUserInfo] = useRequest<IUser>();
	const [, doLogin] = useRequest<Record<string, string>>();

	const navigate = useNavigate();

	useEffect(() => {
		userId && setStep(3);
	}, [userId]);

	const onCloseModal = (isOk: boolean) => {
		if (isOk) {
			setStep(3);
			setEmail(null);
		} else {
		}
	};

	// 1. 정보 동의 체크 상태 저장
	const onClickFirstStep = (values: IPrivacyAgree) => {
		console.log(values);
		setChecks(values);
		setStep(2);
	};

	// 2. 사용자 정보 전달
	const onClickSecondStep = async (values: IMembershipCheck) => {
		const { email, password, userName } = values;
		const data: IUser = {
			email: email,
			password: password,
			name: userName,
			nickName: userName.substring(0, 1),
			role: UserRole.user,
			provider: '',
		};

		const res = await setRequest(Method.POST, $api.auth.regist.user, {
			data: data,
			useLoading: false,
			// useShowMessage: { success: true, error: true },
		});

		if (res?.isok) {
			// TODO : 토큰이 없으면 사용자 정보를 수정할 수 없다. 일단 로그인
			onLogin(email as string, password as string);
		}
	};

	const onLogin = async (email: string, password: string) => {
		const res: any = await doLogin(Method.POST, $api.auth.login, {
			data: { email: email, password: password },
		});

		const { accessToken, refreshToken, accessTokenExpireDate } = res?.data;
		Session.setUserInfo({
			...Parser.userInfo(res?.data?.userDetail),
			accessToken,
			refreshToken,
			accessTokenExpireDate,
		} as any);
	};

	// 3. 추가 정보 전달
	const onClickFinalStep = async (values: IMemberAdditionInfo | null) => {
		// console.log(values);

		// 정보가 있으면 저장
		if (values) {
			const params = { ...values, id: userId };
			const res = await doRequestUserInfo(Method.PUT, $api.member.root, {
				params: params,
			});

			if (res) {
				setTimeout(() => navigate($url.login.root), 500);
			}
		} else {
			// 없으면 건너띄기
			navigate($url.login.root);
		}
	};

	return (
		<div className='login'>
			<LeftBg className='position-absolute left bottom-0' />
			<RightBg className='position-absolute end-0 top' />
			<Container fluid className='h-100'>
				<Row className='justify-content-center align-items-center h-100'>
					{step === 1 && <PrivacyAgree onClick={onClickFirstStep} />}
					{step === 2 && <MamberShip onClick={onClickSecondStep} />}
					{step === 3 && <AdditionalInfo onClick={onClickFinalStep} />}
					{email && (
						<ModalAuthCodeCheck
							email={email}
							header={false}
							onClose={onCloseModal}
						/>
					)}
				</Row>
			</Container>
		</div>
	);
};

export default Register;
