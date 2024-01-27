import { THUMB_PREFIX } from '@/hooks/useRequest';
import { styled } from '@stitches/react';
import { ChangeEvent, forwardRef, useState } from 'react';
import { Input } from 'reactstrap';

const StyledInputFile = styled('div', {
	cursor: 'pointer',

	'& > * ': {
		cursor: 'pointer',
	},

	'.file-select': {
		display: 'none',
	},
});

const InputFile = forwardRef(
	(
		{
			defaultValue,
			className = '',
			onSelect,
			placeholder = '파일을 선택하세요',
			accept = '.png,.jpg,.jpeg,.pdf',
			disabled,
		}: {
			defaultValue?: string;
			className?: string;
			onSelect?: (
				files: FileList | null,
				e: ChangeEvent<HTMLInputElement>
			) => void;
			placeholder?: string;
			accept?: string;
			disabled?: boolean;
		},
		ref?: React.Ref<HTMLInputElement>
	) => {
		const [selected, setSelected] = useState<FileList | null>();

		const onClick = (e: ChangeEvent<HTMLInputElement>) => {
			const { files } = e?.currentTarget;
			if (files && files.length > 0) {
				setSelected(files);
				onSelect?.(files, e);
			} else {
				setSelected(null);
				onSelect?.(null, e);
			}
		};

		const parseFileName = (value?: string) => {
			if (!value) return '';

			const temp = value.replace(THUMB_PREFIX, '');
			const temps = temp.split('/');
			return temps[temps.length - 1];
		};

		return (
			<StyledInputFile className={`${className || ''}`}>
				<Input
					className='file-value'
					type='text'
					readOnly={true}
					value={selected?.[0].name || parseFileName(defaultValue)}
					placeholder={placeholder}
					onClick={() => (ref as any)?.current?.click()}
				/>
				<Input
					className='file-select'
					type='file'
					innerRef={ref}
					disabled={disabled}
					placeholder={placeholder}
					accept={accept}
					onChange={onClick}
				/>
			</StyledInputFile>
		);
	}
);

export default InputFile;
