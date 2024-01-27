import {
	Button,
	Col,
	Accordion,
	AccordionItem,
	AccordionHeader,
	AccordionBody,
} from 'reactstrap';
import { useState } from 'react';
import { CheckBox } from '@/components/InputForm';
import { register as R } from '@/langs/auth.langs';
import { IPrivacyAgree } from '@/types/interfaces';

const PrivacyAgree = ({
	onClick,
}: {
	onClick: (checks: IPrivacyAgree) => void;
}) => {
	const [open, setOpen] = useState<string>('1');
	const [checks, setChecks] = useState<IPrivacyAgree>({
		service: false,
		privacy: false,
		info: false,
	});

	const onChecked = (tag: 'service' | 'privacy' | 'info', isok: boolean) => {
		const objs = { ...checks, [tag]: isok };

		tag === 'service' && setOpen('1');
		tag === 'privacy' && setOpen('2');
		tag === 'info' && setOpen('3');

		setChecks(objs);
	};

	const isAllChecked = () => {
		return checks['service'] && checks['privacy'] && checks['info'];
		// Object.keys(checks).every(key => checks[key] === true);
	};

	const onAllChecked = () => {
		if (isAllChecked()) {
			setChecks({
				service: false,
				privacy: false,
				info: false,
			});
		} else {
			setChecks({
				service: true,
				privacy: true,
				info: true,
			});
		}
	};

	const isNext = () => {
		return checks.service && checks.privacy;
	};

	return (
		<Col lg='3' className='register-box'>
			<h4 className='mb-4 fw-bold text-center'>{R.title.membership}</h4>
			<p className='mb-2 fs-5'>{R.label.privacy}</p>
			<CheckBox
				className='mb-2'
				checked={isAllChecked()}
				title={R.label.check_all}
				onChecked={onAllChecked}
			/>
			<Accordion open={open} toggle={(id: string) => setOpen(id)}>
				<ListItem
					title={R.label.check_service}
					targetId='1'
					checked={checks.service}
					onChecked={(value) => onChecked('service', value)}
				>
					<>
						<strong>This is the first item&#39;s accordion body.</strong>
						You can modify any of this with custom CSS or overriding our default
						variables. It&#39;s also worth noting that just about any HTML can
						go within the <code>.accordion-body</code>, though the transition
						does limit overflow.
						<strong>This is the first item&#39;s accordion body.</strong>
						You can modify any of this with custom CSS or overriding our default
						variables. It&#39;s also worth noting that just about any HTML can
						go within the <code>.accordion-body</code>, though the transition
						does limit overflow.
						<strong>This is the first item&#39;s accordion body.</strong>
						You can modify any of this with custom CSS or overriding our default
						variables. It&#39;s also worth noting that just about any HTML can
						go within the <code>.accordion-body</code>, though the transition
						does limit overflow.
						<strong>This is the first item&#39;s accordion body.</strong>
						You can modify any of this with custom CSS or overriding our default
						variables. It&#39;s also worth noting that just about any HTML can
						go within the <code>.accordion-body</code>, though the transition
						does limit overflow.
					</>
				</ListItem>
				<ListItem
					title={R.label.check_privacy}
					targetId='2'
					checked={checks.privacy}
					onChecked={(checked) => onChecked('privacy', checked)}
				>
					<>
						<strong>This is the first item&#39;s accordion body.</strong>
					</>
				</ListItem>
				<ListItem
					title={R.label.check_info}
					targetId='3'
					checked={checks.info}
					onChecked={(checked) => onChecked('info', checked)}
				>
					<>
						<strong>This is the first item&#39;s accordion body.</strong>
						You can modify any of this with custom CSS or overriding our default
						variables. It&#39;s also worth noting that just about any HTML can
						go within the <code>.accordion-body</code>, though the transition
						does limit overflow.
					</>
				</ListItem>
			</Accordion>
			<Button
				type='submit'
				className='mt-5 w-100'
				color='info'
				size='md'
				disabled={!isNext()}
				onClick={() => onClick(checks)}
			>
				{R.button.next}
			</Button>
		</Col>
	);
};

const ListItem = ({
	title,
	targetId,
	children,
	checked = false,
	onChecked,
}: {
	title: string;
	targetId: string;
	children: JSX.Element;
	checked: boolean;
	onChecked: (checked: boolean) => void;
}) => {
	return (
		<AccordionItem>
			<AccordionHeader targetId={targetId}>
				<CheckBox checked={checked} title={title} onChecked={onChecked} />
			</AccordionHeader>
			<AccordionBody accordionId={targetId}>{children}</AccordionBody>
		</AccordionItem>
	);
};

export default PrivacyAgree;
