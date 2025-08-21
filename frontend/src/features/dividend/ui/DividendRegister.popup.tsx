import { NumberInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { FieldValues, useForm } from 'react-hook-form';
import { DividendItemType as DataType, DividendStockType as StockType } from '../api/dividend.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { toNumber, toNumeric, withCommas } from '@shared/libs/utils.lib';
import { Schema } from '@shared/hooks/useCommon.hook';
import { useCreateDividend as useCreate, useUpdateDividend as useUpdate } from '../api/dividend.api';
import { DATE_DB_FORMAT } from '@shared/config/common.constant';
import { useMemo } from 'react';
import { OptionType } from '@shared/config/common.type';
import { AutoCompleteForm } from '@entites/AutoComplete';
import { SelectOptionType } from '@entites/SelectForm';

const StyledForm = styled(Flex, {});

export const DividendRegisterPopup = ({
	stocks,
	item,
	onClose,
}: {
	stocks?: StockType[];
	item?: DataType;
	onClose: (isOk: boolean) => void;
}) => {
	const isEditMode = useMemo(() => !!item?.rowid, [item]);
	const stockOptions = useMemo(() => stocks?.map((a) => ({ value: a.code, label: a.name }) as OptionType), [stocks]);

	const forms = useForm({
		defaultValues: isEditMode
			? {
					code: { label: item?.name, value: item?.code },
					date: dayjs(item?.sdate).toDate(),
					cost: withCommas(item?.cost),
					count: withCommas(item?.count),
					price: withCommas(item?.price),
					tax: withCommas(Number(item?.cost) * Number(item?.count) - Number(item?.price)),
				}
			: {
					date: new Date(),
					cost: '',
					count: '',
					price: '',
					tax: '',
				},
		resolver: zodResolver(
			z.object({
				code: z.refine((v) => !!v, { message: ST.PLEASE_SELECT }),
				date: Schema.DefaultDate,
				cost: Schema.DefaultNumber,
				count: Schema.DefaultNumber,
				price: Schema.DefaultNumber,
				tax: Schema.DefaultNumber,
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
						code: (fields?.code as SelectOptionType)?.value,
						cost: Number(toNumber(fields.cost)),
						count: Number(toNumber(fields.count)),
						price: Number(toNumber(fields.price)),
						sdate: dayjs(fields?.date).format(DATE_DB_FORMAT),
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
	// 23010

	const onChange = (option: SelectOptionType | null) => {
		if (option) {
			const item = stocks?.find((a) => a.code === option.value);
			if (item?.kcount) {
				forms.setValue('count', item?.kcount);
				forms.clearErrors('count');
			}
		}
	};

	const onChangeTax = () => {
		const { price, cost, count } = forms?.getValues() as FieldValues as DataType;

		if (price && cost && count) {
			forms?.setValue('tax', withCommas(toNumeric(cost) * toNumeric(count) - toNumeric(price)));
		}
	};

	return (
		<Dialog title={`${ST.DIVIDEND}(${isEditMode ? ST.UPDATE : ST.ADD})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm id='date' label={ST.DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
				<AutoCompleteForm id='code' formMethod={forms} options={stockOptions || []} onChange={onChange} />
				<NumberInputForm id='count' label={ST.STOCK_COUNT} formMethod={forms} maxLength={8} focused />
				<NumberInputForm
					id='cost'
					label={ST.STOCK_PER_COST}
					formMethod={forms}
					maxLength={12}
					autoFocus
					onChange={onChangeTax}
				/>
				<NumberInputForm
					id='price'
					label={ST.DIVIDEND_TOTAL}
					formMethod={forms}
					maxLength={12}
					focused
					onChange={onChangeTax}
				/>
				<NumberInputForm
					id='tax'
					label={ST.PRICE_TAX}
					formMethod={forms}
					maxLength={8}
					focused
					readOnly
					onChange={onChangeTax}
				/>
			</StyledForm>
		</Dialog>
	);
};
