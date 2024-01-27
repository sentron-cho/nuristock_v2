import { Button, InputGroup, Input } from 'reactstrap';
import { useEffect, useRef, useState } from 'react';
import { styled } from '@stitches/react';

export const StyledComponent = styled(InputGroup, {
	'&.input-group': {
		border: `1px solid $border`,
		borderRadius: '4px',
		height: '34px',

		'& > *': {
			height: '100%',
		},

		'&:hover': {
			borderColor: '$borderHover',
		},

		'button, input': {
			border: 'none',
		},

		'.right-btn': {
			'& > *': {
				borderRadius: '0 2px 2px 0',
				minWidth: '40px',
				height: '100%',
				padding: '0',
			},
		},
	},
});

const InputSearch = ({
	onClick,
	placeholder = '',
	clear = '',
	className = '',
	rightButton,
}: {
	onClick: (value: string | undefined) => void;
	placeholder?: string;
	clear?: string;
	className?: string;
	rightButton?: React.ReactElement;
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState<string>('');

	useEffect(() => {
		if (inputValue === '') return;
		console.log('clear');
		setInputValue('');
	}, [clear]);

	const onClickSearch = () => {
		const value = inputRef?.current?.value;
		onClick(value);
	};

	const onKeyUp = (e: React.KeyboardEvent) => {
		if (e.key.toLowerCase() === 'enter') {
			onClickSearch();
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.currentTarget.value);
	};

	return (
		<StyledComponent className={`input-search ${className || ''}`}>
			<Button className='search-icon' color='white' onClick={onClickSearch}>
				<i className='bi bi-search'></i>
			</Button>
			<Input
				innerRef={inputRef}
				type='text'
				placeholder={placeholder}
				onKeyUp={onKeyUp}
				spellCheck={false}
				value={inputValue}
				onChange={onChange}
			/>
			{rightButton && <span className='right-btn'>{rightButton}</span>}
		</StyledComponent>
	);
};

export default InputSearch;
