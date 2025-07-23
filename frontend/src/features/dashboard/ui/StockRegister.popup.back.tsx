import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { useSelectMarket } from '@features/market/api/market.api';
import { useEffect, useMemo, useState } from 'react';
import Flex from '@entites/Flex';
import { AutoCompleteForm } from '@entites/AutoComplete';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { sortBy } from 'lodash';

export const StockRegisterPopup = ({ onClose }: { onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const forms = useForm({
		defaultValues: { search: undefined },
	});

	const [search, setSearch] = useState<string>();

	const { data, isPending } = useSelectMarket();
	const list = useMemo(() => {
		const items = data?.value?.map((a) => ({ label: `${a?.name}(${a?.code})`, value: a?.code }));
		return sortBy(items, ['label']);
	}, [data]);

	const filtered = useMemo(() => {
		console.log(search);
		if (search && search?.length > 0) {
			const items = list?.filter((a) => a?.label.includes(search));
			console.log(items);
			return items;
			// return list?.filter((a) => a?.label.includes(search));
		} else {
			return list?.slice(0, 100);
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

	return (
		<Dialog title={ST.STOCK_APPEND} onClose={onClickClose}>
			{!list?.length || (isPending && 'Loading...')}
			{!isPending && (
				<Flex direction={'column'}>
					<AutoCompleteForm
						id='search'
						formMethod={forms}
						options={filtered}
						onInput={(e) => {
							console.log({ e });
							setSearch((e?.target as HTMLInputElement).value);
						}}
						label='종목 선택'
						placeholder='종목명을 입력하세요'
					/>
					{/* <TextInputForm size='small' id='textInput' formMethod={forms} onClearError={onClearError} maxLength={10} /> */}
				</Flex>
			)}
		</Dialog>
	);
};
