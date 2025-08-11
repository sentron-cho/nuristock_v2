import Flex from '@entites/Flex';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';

export const InvestmentHeader = ({
	// onClick
}: {
	// onClick?: (eid: string, value: unknown) => void
}) => {

	return (
		<ContentsHeader stickyTop={44} minHeight={100}>
			<Flex justify={'end'}>
			</Flex>
		</ContentsHeader>
	);
};
