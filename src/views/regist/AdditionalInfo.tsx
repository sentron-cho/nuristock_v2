import { Button, Row, Col } from 'reactstrap';
import { register as R } from '@/langs/auth.langs';
import { useRef } from 'react';
import { IMemberAdditionInfo } from '@/types/interfaces';
import useAlert from '@/hooks/useAlert';
import { validstr } from '@/langs/common.langs';
import CareerSelect from '@/components/CareerSelect';
import DropMenuUserType from '@/components/DropMenuUserType';

const AdditionalInfo = ({
	onClick,
}: {
	onClick: (values: IMemberAdditionInfo | null) => void;
}) => {
	const jobRef = useRef<HTMLInputElement>(null);
	const majorRef = useRef<HTMLInputElement>(null);
	const minorRef = useRef<HTMLInputElement>(null);
	const { showAlertError } = useAlert();

	const onSubmit = () => {
		const jobType = jobRef?.current?.value;
		const majorCareer = majorRef?.current?.value;
		const minorCareer = minorRef?.current?.value;

		if (!jobType) return showAlertError(validstr.addinfo.job);
		if (!majorCareer) return showAlertError(validstr.addinfo.major);
		if (!minorCareer) return showAlertError(validstr.addinfo.minor);

		onClick({
			jobType: jobType,
			majorCareer: majorCareer,
			minorCareer: minorCareer,
		});
	};

	return (
		<>
			<Col lg='12' className='register-box add-info'>
				<h4 className='mb-4 fw-bold text-center'>{R.title.additional_info}</h4>
				<p className='mb-2 fs-5 text-center'>{R.label.additional_info}</p>

				<DropMenuUserType ref={jobRef} />

				<Row>
					<Col md='8' className='m-auto'>
						<CareerSelect
							ref={majorRef}
							type='major'
							style={{ marginTop: '40px' }}
						/>

						<CareerSelect
							ref={minorRef}
							type='minor'
							style={{ marginTop: '34px' }}
						/>
					</Col>
				</Row>

				<Row className='mt-5'>
					<Col xl='6'>
						<Button
							type='button'
							color='secondary'
							className='w-100'
							onClick={() => onClick(null)}
						>
							{R.button.skip}
						</Button>
					</Col>
					<Col xl='6'>
						<Button
							type='submit'
							className='w-100'
							color='info'
							onClick={onSubmit}
						>
							{R.button.ok}
						</Button>
					</Col>
				</Row>
			</Col>
		</>
	);
};

export default AdditionalInfo;
