import Thumbnail from '@/components/Thumbnail';
import { ICategory, ILibrary } from '@/types/interfaces';
import { styled } from '@stitches/react';
import { SyntheticEvent, useState } from 'react';
import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import * as ICon from 'react-feather';
import { editor as R } from '@/langs/views.langs';
import NoData from '@/components/NoData';

export const StyledList = styled('div', {
	fontSize: '16px',
	'.row': {
		padding: 0,
		margin: 0,
	},

	'.list-group-item': {
		padding: '0',
		overflow: 'hidden',

		'&.active': {
			background: '$light',
			color: '$dark',
			borderColor: 'var(--bs-border-color)',
		},
	},

	'.tit-bar': {
		padding: '4px',
		background: '$light',

		'.list-title': {
			display: 'flex',
			width: '100%',
			justifyContent: 'space-between',
			padding: '4px',
		},

		'.list-buttons': {
			width: '280px',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			paddingRight: '30px',
		},
	},

	'.lib-items': {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'start',
		maxHeight: '400px',
		overflow: 'hidden',
		overflowY: 'scroll',
		background: 'white',

		'& > span': {
			width: '25%',
			padding: '8px 4px',
			'.thumb': {
				width: '100%',
				height: '56px',
				boxSizing: 'border-box',
			},
			// '.img': { margin: '4px 2px' },
		},
	},

	'span.content': {
		fontSize: '14px',
		padding: '20px 100px 0 100px',
		lineHeight: '22px',
	},
});

const SidebarLibraryList = ({
	categories,
	libraries,
	onSelect,
	className,
}: {
	categories?: ICategory[];
	libraries?: ILibrary[];
	onSelect?: (item: ILibrary) => void;
	className?: string;
}) => {
	const [selected, setSelected] = useState<ICategory>();

	const onClickItem = (item: ICategory) => {
		setSelected(undefined);
		if (item.id === selected?.id) return setSelected(undefined);
		if (!selected) setSelected(item);
		else {
			setTimeout(() => {
				setSelected(item);
			}, 300);
		}
		// onSelect?.(item);
	};

	const onSelectItem = (e: SyntheticEvent, item: ILibrary) => {
		e.stopPropagation();
		onSelect?.(item);
	};

	if (!categories) return <></>;

	return (
		<StyledList className={`${className || ''}`}>
			<ListGroup>
				{categories.map((item) => {
					const isActive = selected?.id === item.id;
					const libs = libraries?.filter((a) => a.categoryId === item.id);

					return (
						<ListGroupItem
							key={item.id}
							action
							onClick={() => onClickItem(item)}
							className={`${isActive && 'active'}`}
						>
							<div className={`row align-items-center cursor-pointer tit-bar`}>
								<span className='list-title'>
									<span className='tit px-2'>{item.title}</span>
									{isActive ? <ICon.ChevronUp /> : <ICon.ChevronDown />}
								</span>
							</div>
							<Collapse isOpen={isActive} className='lib-items'>
								{!libs || libs?.length < 1 ? (
									<NoData size='sm' title={R.placeholder.nosearch} />
								) : (
									libs?.map((library, index) => {
										return (
											<span key={`${item.id}-${index}`}>
												<Thumbnail
													src={library.image}
													size='sm'
													onClick={(e) => onSelectItem(e, library)}
												/>
											</span>
										);
									})
								)}
							</Collapse>
						</ListGroupItem>
					);
				})}
			</ListGroup>
		</StyledList>
	);
};

export default SidebarLibraryList;
