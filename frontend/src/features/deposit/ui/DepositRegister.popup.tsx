import { NumberInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { DepositItemType as DataType } from '../api/deposit.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { toNumber, toNumeric, withCommas } from '@shared/libs/utils.lib';
import { Schema } from '@shared/hooks/useCommon.hook';
import { useCreateDeposit as useCreate } from '../api/deposit.api';
import { DATE_TIME_DB_FORMAT } from '@shared/config/common.constant';
import { useMemo } from 'react';
import { Deposit } from '@shared/config/common.enum';
import { SelectForm } from '@entites/SelectForm';

const StyledForm = styled(Flex, {});

export const DepositRegisterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const typeOptions = useMemo(() => {
		return [
			{ label: ST.BANK_INPUT, value: Deposit.DEPOSIT },
			{ label: ST.BANK_OUTPUT, value: Deposit.WITHDRAW },
			{ label: ST.DIVIDEND, value: Deposit.DIVIDEND },
			{ label: ST.HEND_WRITING, value: Deposit.MANUAL },
		];
	}, []);

	const forms = useForm({
		defaultValues: {
			stype: Deposit.DEPOSIT,
			sdate: new Date(),
			price: '',
			priceTax: '0',
			priceAfterTax: '0',
		},
		resolver: zodResolver(
			z.object({
				stype: z.refine((v) => !!v, { message: ST.PLEASE_SELECT }),
				sdate: Schema.DefaultDate,
				price: Schema.DefaultNumber,
				priceAfterTax: Schema.DefaultNumber,
				priceTax: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: createData } = useCreate();

	const selectedType = forms?.watch('stype');

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					const price = Number(toNumber(fields.price));
					const stype = fields?.stype as string;

					let params = {
						rowid: item?.rowid,
						stype: stype,
						sdate: dayjs(fields?.sdate).format(DATE_TIME_DB_FORMAT),
						price: stype === Deposit.WITHDRAW && price > 0 ? price * -1 : price,
						tax: 0,
					};

					if (selectedType === Deposit.DIVIDEND) {
						params['price'] = Number(toNumber(fields?.priceAfterTax) || 0);
						params['tax'] = Number(toNumber(fields?.priceTax) || 0);
					}

					console.log({ params });

					await createData(params);

					onClose?.(isOk);
				},
				(error) => {
					console.error('[error]', { error });
				}
			)();
		} else {
			onClose?.(false);
		}
	};

	const onChange = () => {
		const before = forms?.getValues('price') as string; // 세전 금액
		const after = forms?.getValues('priceAfterTax') as string; // 세후 금액
		if (before && after) {
			const value = Number(toNumeric(before)) - Number(toNumeric(after));
			forms?.setValue('priceTax', withCommas(value) || 0);
		}
	};

	return (
		<Dialog title={`${ST.DEPOSIT}(${ST.ADD})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<SelectForm
					popperProps={{ className: 'dialog' }}
					className='radius'
					size='medium'
					id='stype'
					options={typeOptions}
					formMethod={forms}
				/>
				<DatePickerForm id='sdate' label={ST.DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
				<NumberInputForm
					id='price'
					label={ST.PRICE_BEFORE_TAX}
					formMethod={forms}
					maxLength={12}
					focused
					autoFocus
					onChange={onChange}
				/>
				{selectedType === Deposit.DIVIDEND && (
					<>
						<NumberInputForm
							id='priceAfterTax'
							label={ST.PRICE_AFTER_TAX}
							formMethod={forms}
							maxLength={12}
							onChange={onChange}
						/>
						<NumberInputForm id='priceTax' label={ST.PRICE_TAX} readOnly formMethod={forms} maxLength={12} />
					</>
				)}
			</StyledForm>
		</Dialog>
	);
};
