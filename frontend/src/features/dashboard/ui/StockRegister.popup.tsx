import { Dialog } from '@entites/Dialog';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { useSelectMarket } from '@features/market/api/market.api';
import { useMemo, useState } from 'react';
import Flex from '@entites/Flex';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { sortBy } from 'lodash';
import { ListForm, ListItemType } from '@entites/ListForm';
import { styled } from '@stitches/react';
import clsx from 'clsx';
import { SearchFieldForm } from '@entites/SearchFieldForm';
import { MarketItemType } from '@features/market/api/market.dto';
import { useCreateDashboard } from '@features/dashboard/api/dashboard.api';
import { IconEdit } from '@entites/Icons';
import { FormField } from '@entites/FormField';
import { TextInputForm } from '@entites/TextInputForm';
import { toCost, withCommas } from '@shared/libs/utils.lib';

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

	'.stock-info': {
		marginTop: 20,
		padding: 10,

		'.text-input': {
			width: 'unset',
			flex: 1,
			marginRight: 10,
		},
	},
});

export const StockRegisterPopup = ({ onClose }: { onClose: (isOk: boolean) => void }) => {
	const { showToast, showAlert } = useCommonHook();

	const forms = useForm<FieldValues>({ defaultValues: { search: '', title: '' } });
	const [selected, setSelected] = useState<MarketItemType>();

	const { data, isPending } = useSelectMarket();
	const { mutateAsync: createData } = useCreateDashboard();

	const list = useMemo(() => {
		const items = data?.value?.map((a) => ({ text: `${a?.name}(${a?.code})`, id: a?.code }));
		return sortBy(items, ['text']);
	}, [data]);

	const search = forms?.watch('search');

	const filtered = useMemo(() => {
		if (search && search?.length > 0) {
			const items = list?.filter((a) => a?.text.includes(search))?.slice(0, 50);
			return items;
		} else {
			return list?.slice(0, 50);
		}
	}, [search, list]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (values) => {
					// 검색 필드 미 입력시
					if (!values?.search) {
						return forms.setError('search', { message: ST.INPUT_SEARCH });
					}

					// 검색된 결과 미 선택시
					if (!selected) {
						return showAlert({ content: ST.SELECT_SEARCH });
					}

					await createData({ ...selected, name: forms?.getValues('title') || selected?.name });
					showToast('registered');
					onClose?.(isOk);
				}
				// (error) => {
				// 	console.error('[error]', { error });
				// }
			)();
		} else {
			onClose(false);
		}
	};

	const onSelect = (item: ListItemType) => {
		setSelected(data?.value?.find((a) => a.code === item?.id));
		forms?.setValue('search', item?.text);
		forms?.clearErrors('search');
	};

	const onClear = () => {
		setSelected(undefined);
	};

	return (
		<StyledDialog className='stock-register' title={ST.STOCK_APPEND} onClose={onClickClose}>
			{!list?.length || (isPending && 'Loading...')}
			{!isPending && (
				<Flex direction={'column'} gap={0} className={clsx('popup-contents')}>
					<SearchFieldForm id={'search'} formMethod={forms} onClear={onClear} />
					<Flex className='list-layer'>
						{selected && <SelectionItemInfo item={selected} formMethod={forms} />}
						{!selected && <ListForm searchValue={search} size='small' items={filtered} onSelect={onSelect} />}
					</Flex>
				</Flex>
			)}
		</StyledDialog>
	);
};

const SelectionItemInfo = ({
	item,
	formMethod,
}: {
	item?: MarketItemType;
	formMethod?: UseFormReturn<FieldValues>;
}) => {
	if (!item) return null;

	const [isEditMode, setEditMode] = useState<boolean>(false);

	const market = useMemo(() => {
		const state = item?.state?.toUpperCase() === 'CLOSE' ? ST.CLOSE_STOCK : '';
		const type = item?.type?.toUpperCase() === 'KOSPI' ? ST.KOSPI : ST.KOSDAQ;

		if (item.state?.toUpperCase() === 'OPEN') return type;
		else return state;
	}, [item]);

	const onClickEdit = () => {
		setEditMode((prev) => !prev);
	};

	console.log({ item });

	return (
		<Flex className='stock-info' direction={'column'} justify={'start'} align={'start'} height={'100%'} gap={4}>
			<FormField size='md' className={item?.state} label={ST.MARKET} text={market} />
			<FormField size='md' label={ST.STOCK_CODE} text={item.code} />
			<Flex justify={'start'}>
				<FormField label={market} size='md' text={item.name}>
					{isEditMode && (
						<TextInputForm size='small' fullWidth={false} id='title' value={item.name} formMethod={formMethod} />
					)}
				</FormField>

				<IconEdit fontSize='small' onClick={onClickEdit} />
			</Flex>
			<FormField size='md' label={ST.SISE} text={toCost(item.sise, true)} />
		</Flex>
	);
};
