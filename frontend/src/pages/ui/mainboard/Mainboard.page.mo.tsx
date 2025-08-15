import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { MainHeader } from '@features/main/ui/MainHeader.ui';
import { useMainboardHook } from '@features/main/hook/Mainboard.hook';
import { MainboardItemType, MainboardResponse } from '@features/main/api/mainboard.dto';

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

	return (
		<FormProvider {...formMethods}>
			<StyledPage>
				{/* 컨텐츠 헤더(요약) */}
				<MainHeader />

				{/* 컨텐츠 */}
				<Flex className={clsx('contents-layer')} direction={'column'} onClick={() => onClick?.('main')}>
					메인 컨텐츠
				</Flex>
			</StyledPage>
		</FormProvider>
	);
};
