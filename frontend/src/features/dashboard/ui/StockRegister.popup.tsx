import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { useSelectMarket } from '@features/market/api/market.api';
import { useEffect, useMemo } from 'react';
import Flex from '@entites/Flex';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { sortBy } from 'lodash';
import { ListForm, ListItemType } from '@entites/ListForm';
import { IconClear } from '@entites/Icons';
import { styled } from '@stitches/react';
import clsx from 'clsx';

const StyledFlex = styled(Flex, {
	'.search': {
		'.clear': {
			marginRight: '-10px',
			opacity: '0.7',
			cursor: 'pointer',
			display: 'none',

			'&.active': {
				display: 'block',
			},
		},
	},

	'&.clear': {
		'.tooltip.icon': {
			marginRight: '20px',
		},
	}
});

export const StockRegisterPopup = ({ onClose }: { onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const forms = useForm({ defaultValues: { search: '' } });

	const { data, isPending } = useSelectMarket();
	const list = useMemo(() => {
		const items = data?.value?.map((a) => ({ text: `${a?.name}(${a?.code})`, id: a?.code }));
		return sortBy(items, ['label']);
	}, [data]);

	const search = forms?.watch('search');

	const filtered = useMemo(() => {
		// console.log(search);
		if (search && search?.length > 0) {
			const items = list?.filter((a) => a?.text.includes(search));
			// console.log(items);
			return items;
			// return list?.filter((a) => a?.label.includes(search));
		} else {
			return list; //?.slice(0, 100);
		}
	}, [search, list]);

	useEffect(() => {
		console.log(list);
	}, [list]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				(values) => {
					console.log('[success]', { values });

					if (!values?.search) {
						forms.setError('search', { message: '입력하세요' });
						return;
					}

					showToast('registered');
					onClose?.(isOk);
				},
				(error) => {
					console.error('[error]', { error });
				}
			)();
		} else {
			onClose(false);
		}
	};

	// const onClearError = (id: string) => {
	// 	forms?.clearErrors(id as never);
	// };

	const onSelect = (item: ListItemType) => {
		console.log('[onSelect]', item);
		forms?.setValue('search', item?.text);
		forms?.clearErrors('search');
	};

	const onClear = () => {
		forms?.setValue('search', '');
	};

	return (
		<Dialog title={ST.STOCK_APPEND} onClose={onClickClose}>
			{!list?.length || (isPending && 'Loading...')}
			{!isPending && (
				<StyledFlex direction={'column'} gap={8} className={clsx({ clear: search?.length })}>
					<TextFieldForm
						className={clsx('search')}
						size='small'
						id='search'
						formMethod={forms}
						// onClearError={onClearError}
						maxLength={10}
						slotProps={{
							input: {
								endAdornment: (
									<IconClear className={clsx('clear', { active: search?.length })} fontSize='small' onClick={onClear} />
								),
							},
						}}
					/>
					<Flex height={'300px'}>
						<ListForm height={'100%'} size='small' type='virtual' items={filtered} onSelect={onSelect} />
					</Flex>
				</StyledFlex>
			)}
		</Dialog>
	);
};
