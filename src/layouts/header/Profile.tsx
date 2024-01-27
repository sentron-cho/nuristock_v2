import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Col,
	Label,
} from 'reactstrap';
import * as Icon from 'react-feather';
import $api, { $url } from '@/request/paths';
import { header as R } from '@/langs/layout.langs';
import * as AUTH from '@/langs/auth.langs';
import { str as STR } from '@/langs/common.langs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import Confirm from '@/components/Confirm';
import useAlert from '@/hooks/useAlert';
import {
	IMembershipFormRef,
	MembershipEditForm,
	setMemvershipFormFieldError,
} from '@/components/MembershipForm';
import { IUser } from '@/types/interfaces';
import Session from '@/store/Session';
import CareerSelect from '@/components/CareerSelect';
import DropMenuUserType, {
	getUserTypeImage,
} from '@/components/DropMenuUserType';
import { UserType } from '@/types/types';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import useRequest, { Method } from '@/hooks/useRequest';

const Profile = () => {
	const [isModal, setModal] = useState<IUser | null>(null);
	const [isConfirm, setConfirm] = useState<boolean>(false);
	const [userInfo, setUserInfo] = useState<IUser | null>(null);
	const { showAlertError } = useAlert();

	const userUpdate = useSelector<RootState>(
		(state) => state.main.user
	) as string;

	const navigate = useNavigate();

	const onLogout = (isOk: boolean) => {
		setConfirm(false);
		if (isOk) {
			Session.removeUserInfo();
			navigate($url.root);
		}
	};

	useEffect(() => {
		const userinfo = Session.getUserInfo();
		setUserInfo(userinfo);
	}, [userUpdate]);

	const onClick = () => {
		if (!userInfo) return showAlertError('로그인 정보가 없습니다.');

		setModal(userInfo);
	};

	return (
		<div>
			<UncontrolledDropdown>
				<DropdownToggle color='transparent' className=''>
					<img
						src={getUserTypeImage(userInfo?.jobType as UserType)}
						alt='profile'
						className='rounded-circle'
						width='30'
					/>
				</DropdownToggle>
				<DropdownMenu className=''>
					<DropdownItem
						className='px-4 py-2 d-flex align-items-center'
						onClick={onClick}
					>
						<Icon.User size={20} />
						<span className='mx-2'>{R.button.profile}</span>
					</DropdownItem>
					<DropdownItem
						className='px-4 py-2 d-flex align-items-center'
						onClick={() => setConfirm(true)}
					>
						<Icon.LogOut size={20} />
						<span className='mx-2'>{R.button.logout}</span>
					</DropdownItem>
				</DropdownMenu>
			</UncontrolledDropdown>

			{isModal && (
				<ModalProfile userInfo={isModal} onClose={() => setModal(null)} />
			)}
			{isConfirm && (
				<Confirm
					title={R.logout.title}
					text={R.logout.label}
					buttonTitle={{ ok: STR.button.yes, cancel: STR.button.no }}
					onClose={onLogout}
				/>
			)}
		</div>
	);
};

const ModalProfile = ({
	userInfo,
	onClose,
}: {
	userInfo: IUser;
	onClose: (isOk: boolean) => void;
}) => {
	const refJob = useRef<HTMLInputElement>(null);
	const refMajor = useRef<HTMLInputElement>(null);
	const refMinor = useRef<HTMLInputElement>(null);
	const refForm = useRef<IMembershipFormRef>(null);
	const [isModefied, setModified] = useState<boolean>(false);
	const { onUpdateUser } = useUser();
	const [, doRequest] = useRequest();
	const [refresh, setRefresh] = useState<string>('');

	const onCloseModal = async (isOk: boolean) => {
		if (!isOk || !userInfo || !refForm?.current) return onClose(false);

		const { current } = refForm;
		const { dirty: isFormModified, isValid } = current;

		// 비밀번호 입력시에 대한 필수 항목 검증
		const { password, passwordCheck, passwordCurrent } = current.values;
		const isAllCheck = password && passwordCheck && passwordCurrent;
		const isChanged = password || passwordCheck || passwordCurrent;

		if (!isAllCheck && isChanged) {
			!passwordCurrent &&
				setMemvershipFormFieldError(current, 'passwordCurrent');
			!password && setMemvershipFormFieldError(current, 'password');
			!passwordCheck && setMemvershipFormFieldError(current, 'passwordCheck');

			return setRefresh(new Date().valueOf().toString());
		}

		// 서브밋 핸들 이벤트 호출
		current.handleSubmit();

		if (!isValid) return;

		let params: IUser = {
			id: userInfo.id,
			password: password,
			// nickName: '', // TODO : 추후 논의후 결정
			jobType: refJob?.current?.value as UserType,
			expDate: '',
			majorCareer: (refMajor?.current?.value as string) || '',
			minorCareer: (refMinor?.current?.value as string) || '',
		};

		if (isFormModified || isModefied) {
			const res = await doRequest(Method.PUT, $api.member.root, {
				params: params,
			});

			if (res.isok) {
				Session.updateUserInfo(params);
				onUpdateUser();
			}
		}

		onClose(true);
	};

	return (
		<Modal
			onClose={onCloseModal}
			title={R.modal.profile.title.myprofile}
			footer={true}
			size='lg'
			height='520px'
		>
			<div className='row'>
				<Col col='6'>
					<Label className='mt-0'>{R.modal.noti.label.title}</Label>
					<MembershipEditForm
						data={userInfo}
						isProfile={true}
						ref={refForm}
						refresh={refresh}
					/>
				</Col>
				<Col col='6'>
					<h2 className='fw-bold fs-5 mt-2'>
						{AUTH.register.title.additional_info}
					</h2>
					<p className='mt-4' style={{ paddingBottom: '18px' }}>
						{AUTH.register.label.additional_info}
					</p>

					{/* 사용자 직업 */}
					<DropMenuUserType
						ref={refJob}
						type={userInfo?.jobType as UserType}
						onClick={() => setModified(true)}
					/>

					{/* 전공 분야 */}
					<CareerSelect
						type='major'
						ref={refMajor}
						selected={userInfo?.majorCareer}
						style={{ marginTop: '30px' }}
						onSelect={() => setModified(true)}
					/>

					{/* 관심 분야 */}
					<CareerSelect
						type='minor'
						selected={userInfo?.minorCareer}
						ref={refMinor}
						style={{ marginTop: '30px' }}
						onSelect={() => setModified(true)}
					/>
				</Col>
			</div>
		</Modal>
	);
};

export default Profile;
