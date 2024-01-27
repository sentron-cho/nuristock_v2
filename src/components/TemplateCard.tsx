import * as Icon from 'react-feather';
import { IRecent, ITemplate } from '@/types/interfaces';
import DropMenu, { IDropMenuItem } from '@/components/DropMenu';
import { str } from '@/langs/common.langs';
import { styled } from '@stitches/react';
import cs from 'classnames';
import Thumbnail from './Thumbnail';

export const StyledTemplateCard = styled('div', {
	'&.card': {
		boxShadow: 'none',
		// paddingBottom: '6px',
		marginBottom: '20px',
		height: '200px',

		'.title': {
			margin: 0,
		},

		'.label': {
			height: '20px',
			color: '$danger',
		},

		'span.thumb': {
			width: '100%',
			height: '160px',
		},
	},

	'.top-icon': {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		padding: '5px 10px',
		top: '0',
		justifyContent: 'space-between',

		'& > span': {
			width: '24px',
		},
	},

	variants: {
		size: {
			sm: {
				'&.card': {
					marginBottom: '10px',
					'.title': {
						fontSize: '13px',
					},

					'.top-icon svg': {
						width: '18px',
						height: '18px',
					},
				},
			},
			md: {
				img: {
					height: '140px',
				},
			},
		},
	},
});

const TemplateCard = ({
	onClickFavorite,
	onClick,
	item,
	onSelectMenu,
	showMessage = false,
	size = 'md',
}: {
	item: ITemplate | null;
	onClickFavorite?: (item: ITemplate) => void;
	onSelectMenu?: (item: ITemplate, selectMenu: IDropMenuItem) => void;
	onClick?: (item: ITemplate) => void;
	showMessage?: boolean;
	size?: 'sm' | 'md';
}) => {
	if (!item) return <></>;

	const onClickFavoriteButton = (e: React.MouseEvent, item: ITemplate) => {
		e.stopPropagation();
		onClickFavorite?.(item);
	};

	return (
		<StyledTemplateCard
			className='border rounded-3 card'
			size={size}
			onClick={() => onClick && onClick(item)}
			style={{ height: showMessage ? '220px' : '200px' }}
		>
			<span className='top-icon'>
				<span onClick={(e) => onClickFavoriteButton(e, item)}>
					<Icon.Star
						className={cs('icon-favorite', { active: item.favorite })}
					/>
				</span>
				{onSelectMenu && (
					<span>
						<DropMenu
							className='recent-menu'
							menus={[
								{ value: 'copy', label: str.dropmenu.recent.copy },
								{ value: 'rename', label: str.dropmenu.recent.rename },
								{ value: 'thumbnail', label: str.dropmenu.recent.thumbnail },
							]}
							icon={<Icon.MoreHorizontal />}
							onSelect={(value) => onSelectMenu(item, value)}
						/>
					</span>
				)}
			</span>

			<Thumbnail
				src={item.image}
				alt='template'
				className='rounded-top'
				size='lg'
				radius={false}
				border={false}
			/>

			<h5 className='mt-2 text-center title'>{item.title}</h5>
			{showMessage && (
				<label className='mt-0 text-center label'>{item.message}</label>
			)}
		</StyledTemplateCard>
	);
};

export default TemplateCard;
