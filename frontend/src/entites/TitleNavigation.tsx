import { SubTitle, Title } from './Title';
import Flex from './Flex';
import clsx from 'clsx';
import { OptionType } from '@shared/config/common.type';
import { styled } from '@styles/stitches.config';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';

const StyledFlex = styled(Flex, {
	'&.title-navi': {
		width: '100%',
		textAlign: 'center',
		minHeight: '28px',
		justifyContent: 'space-between',
		padding: '0 10px',

		'&.sticky': {
			background: '$bgcolor',
			position: 'sticky',
			top: 0,
			zIndex: 10,
			borderBottom: '1px solid $gray500',
		},

		'.button': {
			color: '$gray400',
			position: 'absolute',
			// right: 10,

			'&.left': {
				right: 'unset',
				left: 10,
			},

			'&.right': {
				left: 'unset',
				right: 10,
			},
		},

		'.center': {
			'.sub-title': {
				paddingTop: 2,
				color: '$gray700',
			},
		},
	},
});

export const TitleNavigation = ({
	options,
	value,
	onClick,
	onClickTitle,
	sticky = false,
	stickyTop = 0,
	height = 40,
	withTitleValue = false,
}: {
	options?: OptionType[];
	value?: string;
	onClick?: (eid?: string) => void;
	onClickTitle?: () => void;
	sticky?: boolean;
	stickyTop?: number | string;
	height?: number | string;
	withTitleValue?: boolean;
}) => {
	const { prev, next, current } = useNaviByOptions({ options, value });

	const heightStyle = {
		height: height,
		lineHeight: height,
		minHeight: height,
	};

	return (
		<StyledFlex
			className={clsx('title-navi', { sticky })}
			style={{ top: sticky ? stickyTop : 'unset', ...heightStyle }}
			gap={10}
			justify={'center'}
		>
			{prev && (
				<SubTitle
					fontSize={'small'}
					className={clsx('button', 'left')}
					title={prev.label}
					onClick={() => onClick?.(prev.value)}
				/>
			)}
			{current && (
				<Flex flex={1} justify={'center'} align='center' className={clsx('navi center')} gap={4}>
					<Title title={current?.label} onClick={() => onClickTitle?.()} />
					{withTitleValue && <SubTitle className='sub-title' fontSize={'small'} title={`(${current?.value})`} />}
				</Flex>
			)}
			{next && (
				<SubTitle
					fontSize={'small'}
					className={clsx('button', 'right')}
					title={next.label}
					onClick={() => onClick?.(next.value)}
				/>
			)}
		</StyledFlex>
	);
};
