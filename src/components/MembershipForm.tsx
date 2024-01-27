import { Input, Form } from 'reactstrap';
import { Formik, FormikErrors, FormikProps, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { InputBox } from '@/components/InputForm';
import { valid } from '@/utils/validation';
import { IJsonData, IUser } from '@/types/interfaces';
import { forwardRef, useEffect } from 'react';
import { validstr as str } from '@/langs/common.langs';

export interface IMembershipFormRef extends FormikProps<IJsonData> {}

export const MembershipNewForm = forwardRef(
	({}: {}, ref?: React.Ref<IMembershipFormRef>) => {
		const initValue = {
			name: '',
			email: '',
			password: '',
			passwordCheck: '',
		};

		const validSchema = Yup.object().shape({
			name: valid.userName,
			email: valid.email,
			password: valid.password(),
			passwordCheck: valid.passwordCheck('password'),
		});

		return (
			<div className='user-info'>
				<Formik<IJsonData>
					initialValues={initValue}
					validationSchema={validSchema}
					onSubmit={() => {}}
					innerRef={ref}
					component={({
						errors,
						touched,
					}: {
						errors: FormikErrors<{
							name: string;
							email: string;
							password: string;
							passwordCheck: string;
						}>;
						touched: FormikTouched<{
							name: boolean;
							email: boolean;
							password: boolean;
							passwordCheck: boolean;
						}>;
					}) => (
						<Form className='mt-1'>
							<InputBox
								name={'name'}
								type={'text'}
								errors={errors.name}
								touched={touched.name}
								placeholder={str.membership.name}
							/>

							<InputBox
								name={'email'}
								type={'text'}
								placeholder={str.membership.email}
								errors={errors.email}
								touched={touched.email}
							/>

							<InputBox
								name='password'
								type='password'
								placeholder={str.membership.password}
								errors={errors.password}
								touched={touched.password}
							/>

							<InputBox
								name='passwordCheck'
								type='password'
								placeholder={str.membership.password_check}
								errors={errors.passwordCheck}
								touched={touched.passwordCheck}
							/>
						</Form>
					)}
				/>
			</div>
		);
	}
);

export const setMemvershipFormFieldError = (
	current: IMembershipFormRef,
	filedName: string
) => {
	const { setFieldTouched, setFieldError } = current;
	let message = '';
	if (filedName.startsWith('password')) message = str.membership.password;
	else message = '값을 입력하세요';

	setFieldError(filedName, message);
	setFieldTouched(filedName, true, false);
};

export const MembershipEditForm = forwardRef(
	(
		{
			data,
			isProfile = false,
			refresh = '',
		}: {
			data: IUser | null;
			isProfile?: boolean;
			refresh?: string;
		},
		ref?: React.Ref<IMembershipFormRef>
	) => {
		useEffect(() => {
			// console.log(refresh);
		}, [refresh]);

		const initValue = {
			password: '',
			passwordCheck: '',
			passwordCurrent: '',
		};

		const validSchema = Yup.object().shape({
			password: valid.password(false),
			passwordCheck: valid.passwordCheck('password', false),
			passwordCurrent: valid.password(false),
		});

		return (
			<div className='user-info'>
				<Formik<IJsonData>
					initialValues={initValue}
					validationSchema={validSchema}
					onSubmit={() => {}}
					innerRef={ref}
					component={({
						errors,
						touched,
					}: {
						errors: FormikErrors<{
							password: string;
							passwordCheck: string;
							passwordCurrent: string;
						}>;
						touched: FormikTouched<{
							password: boolean;
							passwordCheck: boolean;
							passwordCurrent: boolean;
						}>;
					}) => (
						<Form>
							<Input
								name={'id'}
								type={'text'}
								disabled={true}
								defaultValue={data?.name}
								style={{ marginBottom: '30px' }}
							/>

							<Input
								name={'email'}
								type={'text'}
								disabled={true}
								defaultValue={data?.email}
								style={{ marginBottom: '30px' }}
							/>

							{isProfile && (
								<InputBox
									name='passwordCurrent'
									type='password'
									placeholder={str.membership.password_current}
									errors={errors.passwordCurrent}
									touched={touched.passwordCurrent}
								/>
							)}

							<InputBox
								name='password'
								type='password'
								placeholder={str.membership.password_new}
								errors={errors.password}
								touched={touched.password}
							/>

							<InputBox
								name='passwordCheck'
								type='password'
								placeholder={str.membership.password_check}
								errors={errors.passwordCheck}
								touched={touched.passwordCheck}
							/>
						</Form>
					)}
				/>
			</div>
		);
	}
);
