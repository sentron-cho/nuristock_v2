import { IconEye } from '@/assets/svg/icnos';
import { ErrorMessage, Field, FieldAttributes } from 'formik';
import { useState } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { styled } from '@stitches/react';

const StyledForm = styled(FormGroup, {
	'.input-form.invalid': {
		marginBottom: '30px',
		'.invalid-feedback': {
			position: 'absolute',
		},
	},
});

export const InputBox = ({
	errors,
	touched,
	name,
	placeholder,
	type = 'text',
	className = '',
	...props
}: {
	errors: boolean | string | undefined;
	touched: boolean | string | undefined;
	name: string;
	placeholder: string;
	className?: string;
	type?: string;
} & FieldAttributes<any>) => {
	const [inputType, setInputType] = useState<string>(type);

	const onMouseDown = () => {
		setInputType('text');
	};

	const onMouseUp = () => {
		setInputType('password');
	};

	return (
		<StyledForm className={className}>
			<div className='input-form invalid'>
				<Field
					name={name}
					type={inputType}
					placeholder={placeholder}
					className={`form-control ${errors && touched ? ' is-invalid' : ''}`}
					onInput={(e: any) => {
						// number 타입에서 maxLength가 설정되지 않는 문제로 아래와 같이 코드 추가
						if (props?.maxLength && inputType === 'number') {
							if (e.target.value.length > e.target.maxLength)
								e.target.value = e.target.value.slice(0, e.target.maxLength);
						}
					}}
					spellCheck={false}
					{...props}
				/>
				<ErrorMessage
					name={name}
					component='div'
					className='invalid-feedback'
				/>
				{type === 'password' && (
					<IconEye onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
				)}
			</div>
		</StyledForm>
	);
};

export const CheckBox = ({
	checked,
	title,
	onChecked,
	className = '',
}: {
	checked: boolean;
	title: string;
	onChecked?: (value: boolean) => void;
	className?: string;
}) => {
	return (
		<Label check className={className}>
			<Input
				type='checkbox'
				checked={checked}
				onChange={(e) => onChecked && onChecked(e.target.checked)}
			/>
			{title}
		</Label>
	);
};
