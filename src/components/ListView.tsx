import { styled } from '@stitches/react';
import { ListGroup, ListGroupItem } from 'reactstrap';

const StyledComponent = styled('div', {
	height: '100%',
	userSelect: 'none',

	'& > .list-group': {
		height: '100%',
		overflow: 'hidden',
		overflowY: 'scroll',
		paddingRight: '5px',

		'.list-group-item': {
			borderRadius: '4px',
			border: 'none',

			'&:after': {
				content: '',
				borderBottom: '1px solid black',
			},
		},
	},

	variants: {
		hover: {
			true: {
				'.list-group-item': {
					cursor: 'pointer',
				},
			},
		},
	},
});

export interface IListItem {
	id: string;
	label: string;
}

const ListView = ({
	items,
	select,
	onSelect,
	className,
}: {
	items: Array<IListItem> | null;
	select?: IListItem | null;
	onSelect?: (item: IListItem) => void;
	className?: string;
}) => {
	const isButtonType = onSelect ? true : false;

	const onClick = (item: IListItem) => {
		onSelect && onSelect(item);
		return;
	};

	return (
		<StyledComponent hover={onSelect && true} className={`${className || ''}`}>
			<ListGroup flush>
				{items &&
					items.map((item) => {
						const active = select?.id === item.id;
						return (
							<ListGroupItem
								key={item.id}
								tag={`${isButtonType ? 'button' : 'a'}`}
								action={isButtonType ? true : false}
								active={isButtonType ? active : false}
								onClick={() => onClick(item)}
							>
								{item.label}
							</ListGroupItem>
						);
					})}
			</ListGroup>
		</StyledComponent>
	);
};

export default ListView;
