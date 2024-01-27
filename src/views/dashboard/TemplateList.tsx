import { Col, Row } from 'reactstrap';
import TitleBar from '@/components/Titlebar';
import { ITemplate } from '@/types/interfaces';
import * as Icon from 'react-feather';
import { IListItem } from '@/components/ListView';
import TemplateCard from '@/components/TemplateCard';
import cs from 'classnames';
import { styled } from '@stitches/react';

const StyledList = styled('div', {
	'.item': {
		flex: '0 0 auto',
		width: '20%',
	},

	'.btn-star': {
		fill: 'transparent',
		stroke: '$secondary',

		'&.active': {
			fill: '$warning',
			stroke: '$warning',
		},
	},
});

export const TemplateList = ({
	items,
	onClickFavorite,
}: {
	items: Array<ITemplate> | null;
	onClickFavorite?: (item: ITemplate) => void;
}) => {
	return (
		<StyledList className='mb-4'>
			{/* <Icon.Star type='button' onClick={onClickFavoriteAll} /> */}
			<Row className='row align-items-center mt-2'>
				{items?.map((item: ITemplate) => (
					<Col
						role='button'
						key={item.id}
						className='mt-2 text-center mx-0 px-1 col-2 item'
					>
						<TemplateCard
							item={item}
							size='sm'
							onClickFavorite={() => onClickFavorite?.(item)}
						/>
					</Col>
				))}
			</Row>
		</StyledList>
	);
};

export const TemplateListAll = ({
	categorys,
	templates,
	onClickFavorite,
	onClickFavoriteAll,
}: {
	categorys: Array<IListItem>;
	templates: Array<ITemplate>;
	onClickFavorite?: (item: ITemplate) => void;
	onClickFavoriteAll?: (items: ITemplate[]) => void;
}) => {
	const onClickFavoriteAllButton = (
		e: React.MouseEvent,
		categoryId: string
	) => {
		e.stopPropagation();
		onClickFavoriteAll?.(
			templates.filter((item) => item.categoryId === categoryId)
		);
	};

	return (
		<StyledList className='mb-4'>
			{categorys.map((category) => {
				const items = templates.filter((a) => a.categoryId === category.id);
				const active = items.filter((a) => a.favorite).length === items.length;
				return (
					<div key={category.id}>
						{items?.length > 0 && (
							<TitleBar title={category.label}>
								<Icon.Star
									type='button'
									className={cs('btn-star', {
										active: active,
									})}
									onClick={(e) => onClickFavoriteAllButton(e, category.id)}
								/>
							</TitleBar>
						)}
						<Row className='row align-items-center mt-2'>
							{items.map((item: ITemplate) => (
								<Col
									role='button'
									key={item.id}
									className='mt-2 text-center mx-0 px-1 col-2 item'
								>
									<TemplateCard
										item={item}
										size='sm'
										onClickFavorite={() => onClickFavorite?.(item)}
									/>
								</Col>
							))}
						</Row>
					</div>
				);
			})}
		</StyledList>
	);
};
