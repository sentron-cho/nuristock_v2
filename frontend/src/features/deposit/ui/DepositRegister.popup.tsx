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
import { toNumber, withCommas } from '@shared/libs/utils.lib';
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
					// stype: '', // menual
					sdate: dayjs(item?.sdate).toDate(),
					price: withCommas(item?.price),
				}
			: {
					sdate: new Date(),
					price: '',
				},
		resolver: zodResolver(
			z.object({
				sdate: Schema.DefaultDate,
				price: Schema.DefaultNumber,
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
					const params = {
						rowid: item?.rowid,
						sdate: dayjs(fields?.sdate).format(DATE_TIME_DB_FORMAT),
						price: Number(toNumber(fields.price)),
						stype: Deposit.MENUAL,
					};

					if (isEditMode) {
						await updateData(params);
					} else {
						await createData(params);
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

	return (
		<Dialog title={`${ST.DEPOSIT}(${isEditMode ? ST.UPDATE : ST.ADD})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm id='sdate' readOnly={isEditMode} label={ST.DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
				<NumberInputForm id='price' label={ST.PRICE} formMethod={forms} maxLength={12} focused autoFocus />
			</StyledForm>
		</Dialog>
	);
};
