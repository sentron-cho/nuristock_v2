import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { useSelectMarket } from '@features/market/api/market.api';
import { useEffect, useMemo } from 'react';
import Flex from '@entites/Flex';
import { AutoCompleteForm } from '@entites/AutoComplete';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCommonHook } from '@shared/hooks/useCommon.hook';

export const StockRegisterPopup = ({ onClose }: { onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const forms = useForm({
		defaultValues: { search: '' },
		resolver: zodResolver(
			z.object({
				search: z.string({ message: '선택하세요.' }),
			})
		),
	});

	const { data, isPending } = useSelectMarket();
	const list = useMemo(() => data?.value, [data]);

	useEffect(() => {
		console.log(list);
	}, [list]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				(values) => {
					console.log('[success]', { values });
					showToast('registered');
					onClose?.(isOk);
				}
				// (error) => {
				// 	console.error('[error]', { error });
				// }
			)();
		}

		onClose?.(isOk);
	};

	const onClearError = (id: string) => {
		forms?.clearErrors(id as never);
	};

	return (
		<Dialog title={ST.STOCK_APPEND} onClose={onClickClose}>
			{!list?.length || (isPending && 'Loading...')}
			{!isPending && (
				<Flex direction={'column'}>
					<AutoCompleteForm
						name='search'
						formMethod={forms}
						options={['삼성전자', 'LG에너지솔루션', '카카오']}
						getOptionLabel={(option) => {
							console.log(option);
							return option;
						}}
						label='종목 선택'
						placeholder='종목명을 입력하세요'
					/>
					{/* <TextFieldForm size='small' id='textInput' formMethod={forms} onClearError={onClearError} maxLength={10} /> */}
				</Flex>
			)}
		</Dialog>
	);
};
