import { NumberInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { toNumber, withCommas } from '@shared/libs/utils.lib';
import { Schema } from '@shared/hooks/useCommon.hook';
import { useMemo } from 'react';
import { BucklistParamType } from '../api/bucketlist.dto';
import { useCreateBucket, useUpdateBucket } from '../api/bucketlist.api';
import dayjs from 'dayjs';

const StyledForm = styled(Flex, {});

export const BucketlistRegister = ({
	item,
	onClose,
}: {
	item?: BucklistParamType;
	onClose: (isOk: boolean) => void;
}) => {
	const isEditMode = useMemo(() => !!item?.rowid, [item]);
	// const { setLocalStorage } = useStorageHook();

	const { mutateAsync: createData } = useCreateBucket();
	const { mutateAsync: updateData } = useUpdateBucket();

	const forms = useForm({
		defaultValues: isEditMode
			? {
					page: item?.page, // 페이지 번호
					startYear: item?.startYear, // 시작 년도
					years: item?.years, // 투자 기간 (년)
					rate: (item?.rate || 0) * 100, // 연 이율 (예: 15%)
					principal: withCommas(item?.principal), // 원금
					annual: withCommas(item?.annual), // 매년 추가 투자액 (연말)
				}
			: {
					page: item?.page,
					startYear: dayjs().year(),
					years: 5,
					rate: 15,
					principal: '',
					annual: '',
				},
		resolver: zodResolver(
			z.object({
				page: Schema.DefaultNumber,
				startYear: Schema.DefaultNumber,
				years: Schema.DefaultNumber,
				rate: Schema.DefaultNumber,
				principal: Schema.DefaultNumber,
				annual: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					const params = {
						page: Number(toNumber(fields.page)),
						startYear: Number(toNumber(fields.startYear)),
						years: Number(toNumber(fields.years)),
						rate: Number((Number(toNumber(fields.rate)) / 100).toFixed(3)),
						principal: Number(toNumber(fields.principal)),
						annual: Number(toNumber(fields.annual)),
					};

					// setLocalStorage(`${StorageDataKey.BUCKET_PARAMS}-${params?.page}`, params);

					if (isEditMode) {
						await updateData({ ...params, rowid: item?.rowid });
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
		<Dialog title={`${ST.BUCKETLIST.TITLE}(${isEditMode ? ST.UPDATE : ST.ADD})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<NumberInputForm id='page' label={ST.BUCKETLIST.PAGE} formMethod={forms} readOnly />
				<NumberInputForm
					id='startYear'
					withComma={false}
					label={ST.BUCKETLIST.START_YEARS}
					formMethod={forms}
					maxLength={4}
					focused
				/>
				<NumberInputForm id='years' label={ST.BUCKETLIST.YEARS} formMethod={forms} maxLength={3} focused />
				<NumberInputForm id='rate' label={ST.BUCKETLIST.RATE} formMethod={forms} maxLength={4} focused />
				<NumberInputForm id='principal' label={ST.BUCKETLIST.PRINCIPAL} formMethod={forms} maxLength={12} autoFocus />
				<NumberInputForm id='annual' label={ST.BUCKETLIST.ANNUAL} formMethod={forms} maxLength={12} focused />
			</StyledForm>
		</Dialog>
	);
};
