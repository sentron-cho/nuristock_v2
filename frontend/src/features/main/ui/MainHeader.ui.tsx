import Flex from '@entites/Flex';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const MainHeader = ({ onClick }: { onClick?: (eid: string, value: unknown) => void }) => {
	const formContext = useFormContext();
	const [isMoreUp, setMoreUp] = useState<boolean>(formContext?.getValues('more') ?? true);

	const { createConfig } = useAppConfigHook({ group: 'dashboard' });

	const onClickMore = () => {
    const value = !isMoreUp;

		setMoreUp(value);
		onClick?.('more', value);
		formContext?.setValue('more', value);
		createConfig({ skey: 'more', svalue: value?.toString() });
	};

	return (
		<ContentsHeader stickyTop={0} minHeight={280}>
			<Flex justify={'center'}>
				{/* 요약보기/전체보기 */}
				<Flex className='more' fullWidth={false} onClick={onClickMore}>
					요약
				</Flex>
			</Flex>
		</ContentsHeader>
	);
};
