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
import { useCreateDeposit as useCreate, useUpdateDeposit as useUpdate } from '../api/deposit.api';
import { DATE_TIME_DB_FORMAT } from '@shared/config/common.constant';
import { useMemo } from 'react';
import { Deposit } from '@shared/config/common.enum';

const StyledForm = styled(Flex, {});

export const DepositRegisterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const isEditMode = useMemo(() => !!item?.rowid, [item]);

	const forms = useForm({
		defaultValues: isEditMode
			? {
					// stype: '', // manual
					sdate: dayjs(item?.sdate).toDate(),
					price: withCommas(item?.tax ? item?.price + item?.tax : item?.price), // 세전
					priceAfterTax: withCommas(item?.price), // 세후
					priceTax: withCommas(item?.tax) || '0', // 세금
				}
			: {
					sdate: new Date(),
					price: '',
					priceAfterTax: '',
					priceTax: '0',
				},
		resolver: zodResolver(
			z.object({
				sdate: Schema.DefaultDate,
				price: Schema.DefaultNumber,
				priceAfterTax: Schema.DefaultNumber,
				priceTax: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: createData } = useCreate();
	const { mutateAsync: updateData } = useUpdate();

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					if (isEditMode) {
						const params = {
							rowid: item?.rowid,
							sdate: dayjs(fields?.sdate).format(DATE_TIME_DB_FORMAT),
							price: Number(toNumber(fields.priceAfterTax)), // 세후
							tax: Number(toNumber(fields.priceTax)), // 세금
						};

						await updateData(params);
					} else {
						// 추가일때만
						const params = {
							rowid: item?.rowid,
							sdate: dayjs(fields?.sdate).format(DATE_TIME_DB_FORMAT),
							price: Number(toNumber(fields.price)),
						};
						await createData({ ...params, stype: Deposit.MANUAL });
					}
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
		<Dialog title={`${ST.DEPOSIT}(${isEditMode ? ST.UPDATE : ST.ADD})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm
					id='sdate'
					readOnly={isEditMode}
					label={ST.DATE}
					placeholder={ST.IN_DATE}
					formMethod={forms}
					align='right'
				/>
				<NumberInputForm
					id='price'
					label={ST.PRICE_BEFORE_TAX}
					formMethod={forms}
					maxLength={12}
					focused
					onChange={onChange}
				/>
				<NumberInputForm
					id='priceAfterTax'
					label={ST.PRICE_AFTER_TAX}
					formMethod={forms}
					maxLength={12}
					focused
					autoFocus
					onChange={onChange}
				/>
				<NumberInputForm id='priceTax' label={ST.PRICE_TAX} readOnly formMethod={forms} maxLength={12} focused />
			</StyledForm>
		</Dialog>
	);
};
