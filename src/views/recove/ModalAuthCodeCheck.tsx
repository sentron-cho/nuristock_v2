import { Button, Row, Col } from 'reactstrap';
import { Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { InputBox } from '@/components/InputForm';
import Modal from '@/components/Modal';
import { str } from '@/langs/common.langs';
import api from '@/request/apis';
import $api from '@/request/paths';
import useAlert from '@/hooks/useAlert';
import { ICodeCheck } from '@/types/interfaces';
import { valid } from '@/utils/validation';

interface IValue extends ICodeCheck {}
interface IError extends ICodeCheck {}
interface ITouched {
	code: boolean;
}

const ModalAuthCodeCheck = ({
	onClose,
	email,
	header = true,
}: {
	onClose: (isOk: boolean) => void;
	email: string;
	header?: boolean;
}) => {
	const { showAlertError } = useAlert();

	const initialValues = {
		code: '',
	};

	const validationSchema = Yup.object().shape({
		code: valid.checkCode,
	});

	const onSubmit = (fields: IValue) => {
		api
			.post($api.auth.code.check, { code: String(fields.code), email: email })
			.then((data) => {
				if (data) {
					onClose(true);
				} else {
					// TODO[SERVER] : 서버 처리되면 메시지 수정
					showAlertError('올바른 인증코드를 입력하세요(테스트 : 123456).');
				}
			})
			.catch((err) => console.error(err)); //!! ErrorBoundary 처리
	};

	return (
		<Modal onClose={() => onClose(false)} header={header}>
			<div>
				<h4>{str.checkcode.title}</h4>
				<p className='mt-2'>{str.checkcode.label}</p>

				<Row>
					<Col lg='8' className='m-auto mt-4'>
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
								<Form className='mt-3'>
									<InputBox
										name='code'
										type='number'
										maxLength={6}
										placeholder={str.checkcode.placeholder}
										errors={errors.code}
										touched={touched.code}
									/>

									<Button
										type='submit'
										className='mt-3 w-100'
										color='info'
										size='md'
									>
										{str.checkcode.ok}
									</Button>
								</Form>
							)}
						/>
					</Col>
				</Row>
			</div>
		</Modal>
	);
};

export default ModalAuthCodeCheck;
