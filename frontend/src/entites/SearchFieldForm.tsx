import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { TextInputForm, TextInputFormProps } from './TextInputForm';
import clsx from 'clsx';
import { useMemo } from 'react';
import { IconClear, IconSearch } from './Icons';
import { Flex } from 'antd';
import { styled } from '@styles/stitches.config';

const StyledFlex = styled(Flex, {
	'&.search-field': {
		position: 'relative',
		width: '100%',
		background: '$white',

    '.MuiInputBase-root': {
			padding: 0,
		},

		'.error': {
			'.buttons': {
				display: 'none',
			},
		},

		'.buttons': {
			cursor: 'pointer',
			position: 'absolute',
			right: 5,

			'.icon-clear': {
				'.tooltip.icon': {
					marginRight: '20px',
				},

				'&.active': {
					display: 'block',
				},
			},
		},
	},
});

type SearchFieldFormProps<T extends FieldValues = FieldValues> = TextInputFormProps & {
	name?: keyof T;
	formMethod?: UseFormReturn<T>;
	onClear?: () => void;
};

export const SearchFieldForm = <T extends FieldValues = FieldValues>(props: SearchFieldFormProps<T>) => {
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);
	const searchValue = props?.formMethod?.getValues(id) || props?.value;
	const error = props?.error || props?.formMethod?.getFieldState(id)?.error;

	const onClear = () => {
		props?.formMethod?.resetField(id);
		props?.onClear?.();
	};

	return (
		<StyledFlex className={clsx('search-field', { error })}>
			<TextInputForm
				{...props}
				className={clsx('search')}
				size='small'
				id={id}
				formMethod={props?.formMethod}
				maxLength={10}
				slotProps={{
					input: {
						endAdornment: (
							<Flex className={clsx('buttons')}>
								{searchValue?.length && <IconClear className={clsx('icon-clear')} fontSize='small' onClick={onClear} />}
								{!searchValue?.length && (
									<IconSearch className={clsx('icon-search')} fontSize='small' onClick={onClear} />
								)}
							</Flex>
						),
					},
				}}
			/>
		</StyledFlex>
	);
};
