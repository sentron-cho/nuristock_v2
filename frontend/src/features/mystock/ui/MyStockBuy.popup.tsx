import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { MyStockKeepType } from '../api/mystock.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';

const StyledForm = styled(Flex, {
	input: {
		textAlign: 'right',
	},
});

interface FormType { date: string, cost: string, count: string }

export const MyStockBuyPopup = ({ item, onClose }: { item?: MyStockKeepType; onClose: (isOk: boolean) => void }) => {
	const forms = useForm({
		defaultValues: { date: '', cost: '', count: '' },
		resolver: zodResolver(
			z.object({
				date: z.string().nonempty({ message: ST.PLEASE_INPUT }),
				cost: z.coerce.number().min(1, ST.ONLY_NUMBER), //z.string().nonempty({ message: ST.PLEASE_INPUT }),
				count: z.coerce.number().min(1, ST.ONLY_NUMBER),
			})
		),
	});
	console.log(item);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				(forms) => {
					console.log('[success]', { forms });
					onClose?.(isOk);
				}
				// (error) => {
				// 	console.log('[error]', { error });
				// }
			)();
		} else {
			onClose?.(false);
		}
	};

	const onClearError = (id: string) => {
		forms?.clearErrors(id as never);
	};

	return (
		<Dialog title={ST.BUY} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<TextFieldForm
					label='날자'
					size='small'
					id='date'
					formMethod={forms}
					maxLength={10}
				/>
				<TextFieldForm
					className='cost'
					label='단가'
					size='small'
					id='cost'
					formMethod={forms}
					maxLength={10}
					// inputMode='numeric'
					focused
				/>
				<TextFieldForm
					className='count'
					label='주식수'
					size='small'
					id='count'
					formMethod={forms}
					maxLength={10}
				/>
			</StyledForm>
		</Dialog>
	);
};
