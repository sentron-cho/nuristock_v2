import { Row, Col, Card } from 'reactstrap';
import { header as R } from '@/langs/layout.langs';
import { useState, useEffect } from 'react';
import { ISubscribtionItem } from '@/types/interfaces';
import Modal from '@/components/Modal';
import cs from 'classnames';
import $api, { $url } from '@/request/paths';
import api from '@/request/apis';
import { styled } from '@stitches/react';

export const StyledSubscribtion = styled('div', {
	'.row': {
		height: '300px',
		display: 'flex',
		flexWrap: 'nowrap',
		overflowX: 'hidden',
		overflowY: 'auto',

		'.card': {
			height: '300px',
			margin: '0',
			cursor: 'pointer',
			border: '1px solid $border',
			borderRadius: '10px',

			'&:hover': {
				border: '1px solid $dark',
			},

			'&.active': {
				border: '3px solid $primary',
			},

			span: {
				margin: '2px 0',
			},
		},
	},
});

const ModalSubscribtion = ({
	onClose,
}: {
	onClose: (isOk: boolean) => void;
}) => {
	const [selected, setSelected] = useState<ISubscribtionItem | null>(null);
	const [items, setItems] = useState<Array<ISubscribtionItem>>();

	useEffect(() => {
		api
			.get($api.root.subscribe)
			.then((data) => setItems(data as Array<ISubscribtionItem>))
			.catch((err) => console.error(err)); //!! ErrorBoundary 처리
	}, []);

	const onCloseModal = (isOk: boolean) => {
		console.log(isOk);
		onClose(isOk);
	};

	const onSelected = (item: ISubscribtionItem) => {
		setSelected(item);
	};

	return (
		<Modal
			onClose={onCloseModal}
			title={R.modal.subscribe.title}
			footer={true}
			size='lg'
			buttonTitle={R.modal.subscribe.button}
		>
			<StyledSubscribtion>
				<Row>
					{items &&
						items.map((item) => (
							<Col key={item.id} className='col-4'>
								<Card
									className={cs('p-3', {
										active: selected && selected.id === item.id,
									})}
									onClick={() => onSelected(item)}
								>
									<span>{item.id}</span>
									<span>{item.title}</span>
									<span>{item.name}</span>
									<span>{item.guide}</span>
									<span>{item.text}</span>
									<span>{item.price}</span>
									<span>{item.data}</span>
									<span>{item.count}</span>
									<span>{item.time}</span>
								</Card>
							</Col>
						))}
					{/* {error && (
						<div>
							<pre>{JSON.stringify(error, null, 4)}</pre>
						</div>
					)} */}
				</Row>
			</StyledSubscribtion>
		</Modal>
	);
};

export default ModalSubscribtion;
