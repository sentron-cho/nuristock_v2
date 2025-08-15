import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { MainboardHeader } from '@features/main/ui/MainboardHeader.ui';
import { useMainboardHook } from '@features/main/hook/Mainboard.hook';
import { MainboardItemType, MainboardResponse } from '@features/main/api/mainboard.dto';
import { toCost } from '@shared/libs/utils.lib';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',
		},
	},
});

export const MainboardPageMo = ({
	data,
	onClick,
}: {
	data?: MainboardResponse;
	onClick?: (eid?: string, item?: MainboardItemType) => void;
}) => {
	const { getConfig } = useMainboardHook(data);

	const formMethods = useForm({ defaultValues: { more: getConfig('more')?.toString() === 'true' } });

	const mock = [
		{ name: '현대차', value: 3000000, key: 'A005380' },
		{ name: '포스코', value: 2000000, key: 'A005490' },
		{ name: '기아', value: 500000, key: 'A000270' },
		{ name: '대한항공', value: 2500000, key: 'A003490' },
		{ name: '우리은행', value: 50000, key: 'A000030' },
	];

	const total = mock?.map((a) => a.value).reduce((a, b) => a + b, 0);

	return (
		<FormProvider {...formMethods}>
			<StyledPage>
				{/* 컨텐츠 헤더(요약) */}
				<MainboardHeader data={mock} centerValue={toCost(total)} />

				{/* 컨텐츠 */}
				<Flex className={clsx('contents-layer')} direction={'column'} onClick={() => onClick?.('main')}>
					메인 컨텐츠
				</Flex>
			</StyledPage>
		</FormProvider>
	);
};
