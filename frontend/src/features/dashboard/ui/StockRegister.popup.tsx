import { Dialog } from '@entites/Dialog';
import { FieldValues, useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { useSelectMarket } from '@features/market/api/market.api';
import { useEffect, useMemo, useState } from 'react';
import Flex from '@entites/Flex';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { sortBy } from 'lodash';
import { ListForm, ListItemType } from '@entites/ListForm';
import { styled } from '@stitches/react';
import clsx from 'clsx';
import { SearchFieldForm } from '@entites/SearchFieldForm';

const StyledDialog = styled(Dialog, {
	overflow: 'hidden',

	'.list-layer': {
		height: '300px',
	},

	'.popup-contents': {
		height: '100%',

		'.list-form': {
			height: 'unset',
			flex: 1,
			overflowY: 'auto',
		},
	},

	'.MuiDialog-paperFullScreen': {
		'.list-layer': {
			height: 'calc(100% - 40px)',
			// height: 'unset',
		},
	},
});

export const StockRegisterPopup = ({ onClose }: { onClose: (isOk: boolean) => void }) => {
	const { showToast, showAlert } = useCommonHook();

	const forms = useForm<FieldValues>({ defaultValues: { search: '' } });
	const [selected, setSelected] = useState<string>();

	const { data, isPending } = useSelectMarket();
	const list = useMemo(() => {
		const items = data?.value?.map((a) => ({ text: `${a?.name}(${a?.code})`, id: a?.code }));
		return sortBy(items, ['text']);
	}, [data]);

	const search = forms?.watch('search');

	const filtered = useMemo(() => {
		// console.log(search);
		if (search && search?.length > 0) {
			const items = list?.filter((a) => a?.text.includes(search))?.slice(0, 50);
			// console.log(items);
			return items;
			// return list?.filter((a) => a?.label.includes(search));
		} else {
			return list?.slice(0, 50);
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

					// 검색 필드 미 입력시
					if (!values?.search) {
						return forms.setError('search', { message: ST.INPUT_SEARCH });
					}

					// 검색된 결과 미 선택시
					if (!selected) {
						return showAlert({ content: ST.SELECT_SEARCH });
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

	const onSelect = (item: ListItemType) => {
		console.log('[onSelect]', item);

		setSelected(item.id as string);
		forms?.setValue('search', item?.text);
		forms?.clearErrors('search');
	};

	const onClear = () => {
		setSelected(undefined);
		// forms?.setValue('search', '');
	};

	return (
		<StyledDialog className='stock-register' title={ST.STOCK_APPEND} onClose={onClickClose}>
			{!list?.length || (isPending && 'Loading...')}
			{!isPending && (
				<Flex direction={'column'} gap={8} className={clsx('popup-contents')}>
					<SearchFieldForm id={'search'} formMethod={forms} onClear={onClear} />
					<Flex className='list-layer'>
						<ListForm selected={selected} size='small' items={filtered} onSelect={onSelect} />
					</Flex>

					{/* <Flex height={'300px'}>
						<ListForm selected={selected} height={'100%'} size='small' type='virtual' items={filtered} onSelect={onSelect} />
					</Flex> */}
				</Flex>
			)}
		</StyledDialog>
	);
};
