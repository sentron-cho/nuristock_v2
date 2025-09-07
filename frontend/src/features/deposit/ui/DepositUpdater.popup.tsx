import { NumberInputForm, TextInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { FieldValues, useForm } from 'react-hook-form';
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
import { useUpdateDeposit as useUpdate } from '../api/deposit.api';
import { DATE_TIME_DB_FORMAT } from '@shared/config/common.constant';
import { useMemo } from 'react';
import { Deposit } from '@shared/config/common.enum';

const StyledForm = styled(Flex, {});

export const DepositUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const isTax = useMemo(() => {
		return item?.stype === Deposit.BUY || item?.stype === Deposit.SELL || item?.stype === Deposit.DIVIDEND;
	}, [item]);

	const title = {
		sell: ST.SELL,
		buy: ST.BUY,
		dividend: ST.DIVIDEND,
		deposit: ST.BANK_INPUT,
		withdraw: ST.BANK_OUTPUT,
		manual: ST.HEND_WRITING,
	} as FieldValues;

	const taxTitle = useMemo(() => {
		if (item?.stype === Deposit.DEPOSIT) return ST.BANK_INPUT;
		else if (item?.stype === Deposit.WITHDRAW) return ST.BANK_OUTPUT;
		// else if (item?.stype === Deposit.DEPOSIT) return ST.PRICE_TAX;
		else return ST.PRICE_TAX;
	}, [item]);

	const beforeTitle = useMemo(() => {
		if (item?.stype === Deposit.DEPOSIT || item?.stype === Deposit.WITHDRAW) return ST.BANK_BEFORE;
		else return ST.PRICE_BEFORE_TAX;
	}, [item]);

	const afterTitle = useMemo(() => {
		if (item?.stype === Deposit.DEPOSIT || item?.stype === Deposit.WITHDRAW) return ST.BANK_AFTER;
		else return ST.PRICE_AFTER_TAX;
	}, [item]);

	const forms = useForm({
		defaultValues: isTax
			? {
					stype: title?.[item?.stype as string], // manual
					sdate: dayjs(item?.sdate).toDate(),
					price: withCommas(item?.tax ? item?.price + item?.tax : item?.price), // 세전
					priceTax: withCommas(item?.tax) || '0', // 세금
					priceAfterTax: withCommas(item?.price), // 세후
				}
			: {
					stype: title?.[item?.stype as string], // manual
					sdate: dayjs(item?.sdate).toDate(),
					priceTax: withCommas(item?.tax) || '0', // 입금, 출금액
					price: withCommas(item?.sdate !== Deposit.DIVIDEND ? Number(item?.price) - Number(item?.tax) : item?.price), // 이전 금액
					priceAfterTax: withCommas(item?.price), // 이후 금액
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

	const { mutateAsync: updateData } = useUpdate();

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					const params = {
						rowid: item?.rowid,
						sdate: dayjs(fields?.sdate).format(DATE_TIME_DB_FORMAT),
						price: Number(toNumber(fields.priceAfterTax)), // 세후
						tax: Number(toNumber(fields.priceTax)), // 세금
					};

					// if (isTax) {
					// 	params['price'] = Number(toNumber(fields.priceAfterTax)); // 세후
					// 	params['tax'] = Number(toNumber(fields.priceTax)); // 세금
					// }

					await updateData(params);

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
		if (isTax) {
			const before = forms?.getValues('price') as string; // 세전 금액
			const after = forms?.getValues('priceAfterTax') as string; // 세후 금액
			if (before && after) {
				const value = Number(toNumeric(before)) - Number(toNumeric(after));
				forms?.setValue('priceTax', withCommas(value) || 0);
			}
		} else {
			const before = forms?.getValues('price') as string; // 이전 잔액
			const after = forms?.getValues('priceAfterTax') as string; // 이후 잔액
			if (before && after) {
				const value = Number(toNumeric(after)) - Number(toNumeric(before));
				forms?.setValue('priceTax', withCommas(value) || 0);
			}
		}
	};

	return (
		<Dialog title={`${ST.DEPOSIT}(${ST.UPDATE})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<TextInputForm className='radius' size='medium' id='stype' formMethod={forms} readOnly={true} />
				<DatePickerForm
					id='sdate'
					readOnly={true}
					label={ST.DATE}
					placeholder={ST.IN_DATE}
					formMethod={forms}
					align='right'
				/>
				<NumberInputForm id='priceTax' label={taxTitle} readOnly formMethod={forms} maxLength={12} focused />
				<NumberInputForm id='price' label={beforeTitle} formMethod={forms} maxLength={12} focused onChange={onChange} />
				<NumberInputForm
					id='priceAfterTax'
					label={afterTitle}
					formMethod={forms}
					maxLength={12}
					focused
					autoFocus
					onChange={onChange}
				/>
			</StyledForm>
		</Dialog>
	);
};
