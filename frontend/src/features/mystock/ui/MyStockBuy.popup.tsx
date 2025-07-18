import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { MyStockKeepType } from '../api/mystock.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { useEffect } from 'react';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { withCommas } from '@shared/libs/utils.lib';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const MyStockBuyPopup = ({ item, onClose }: { item?: MyStockKeepType; onClose: (isOk: boolean) => void }) => {
	const forms = useForm({
		defaultValues: { date: new Date(), cost: '', count: '' },
		resolver: zodResolver(
			z.object({
				date: z.coerce.string().refine(
					(value) => {
						const isValid = dayjs(value).isValid();
						console.log({ value, isValid });
						return isValid;
					},
					{ message: ST.PLEASE_INPUT }
				),
				cost: z.coerce
					.string()
					.refine(
						(value) => {
							return !isNaN(Number(withCommas(value, true)));
						},
						{ message: ST.ONLY_NUMBER }
					)
					.min(1, ST.ONLY_NUMBER),
				count: z.coerce
					.string()
					.refine(
						(value) => {
							return !isNaN(Number(withCommas(value, true)));
						},
						{ message: ST.ONLY_NUMBER }
					)
					.min(1, ST.ONLY_NUMBER),
			})
		),
		shouldFocusError: true,
	});
	console.log(item);

	useEffect(() => {
		setTimeout(() => forms?.setFocus('cost'), 200);
	}, [forms]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				(values) => {
					const params = { ...values, date: dayjs(values?.date).format('YYYY-MM-DD') }
					console.log('[success]', { values, params });
					onClose?.(isOk);
				},
				(error) => {
					console.log('[error]', { error });
				}
			)();
		} else {
			onClose?.(false);
		}
	};

	// const onClearError = (id: string) => {
	// 	forms?.clearErrors(id as never);
	// };

	return (
		<Dialog title={ST.BUY} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm id='date' label='매수일' placeholder='매수일을 선택하세요' formMethod={forms} align='right' />
				<TextFieldForm
					className='cost'
					label='매수 단가'
					placeholder='매수 단가를 입력하세요.'
					size='small'
					id='cost'
					formMethod={forms}
					maxLength={12}
					withComma
					focused
					align='right'
				/>
				<TextFieldForm
					className='count'
					label='매수 개수'
					placeholder='매수 개수를 입력하세요.'
					size='small'
					id='count'
					formMethod={forms}
					maxLength={8}
					withComma
					focused
					align='right'
				/>
			</StyledForm>
		</Dialog>
	);
};
