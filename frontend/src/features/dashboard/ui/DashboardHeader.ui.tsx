import { Button } from '@entites/Button';
import Flex from '@entites/Flex';
import { IconExpandDown, IconExpandUp } from '@entites/Icons';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { ST } from '@shared/config/kor.lang';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const DashboardHeader = ({ onClick }: { onClick?: (eid: string, value: unknown) => void }) => {
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
		<ContentsHeader stickyTop={44}>
			<Flex justify={'end'}>
				{/* 요약보기/전체보기 */}
				<Flex className='more' fullWidth={false} onClick={onClickMore}>
					{isMoreUp && <Button icon={<IconExpandUp />} iconPosition='end' title={ST.MORE_IN} />}
					{!isMoreUp && <Button icon={<IconExpandDown />} iconPosition='end' title={ST.MORE_OUT} />}
				</Flex>
			</Flex>
		</ContentsHeader>
	);
};
