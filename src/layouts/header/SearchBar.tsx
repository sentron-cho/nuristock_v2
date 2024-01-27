import { Button, Row, Col } from 'reactstrap';
import { header as R } from '@/langs/layout.langs';
import { useState, useCallback } from 'react';
import { $url } from '@/request/paths';
import useAlert from '@/hooks/useAlert';
import useSearch from '@/hooks/useSearch';
import InputSearch from '@/components/InputSearch';
import ModalSubscribtion from './ModalSubscribtion';

const SearchBar = () => {
	const [isModal, setModal] = useState<boolean>(false);
	const { showAlertSuccess } = useAlert();
	const { onSearch, onClearSearch } = useSearch();

	const onClickSubscribe = (isOk: boolean) => {
		setModal(false);

		if (isOk) {
			showAlertSuccess(R.alert.subscribe);
		}
	};

	const onClickSearch = (value?: string) => {
		if (value) {
			// showAlertSuccess('데이터 검색' + `(${value})`);
			onSearch(value);
		} else {
			onClearSearch();
		}
	};

	const getSearchPlaceholder = useCallback(() => {
		switch (location.pathname) {
			case $url.apps.dashboard:
				return R.search.board;
			case $url.apps.library:
				return R.search.libary;
			case $url.apps.request:
				return R.search.requset;
			case $url.apps.recent:
				return R.search.recent;
			case $url.apps.faq:
				return R.search.faq;
			case $url.apps.contact:
				return R.search.contact;
			case $url.apps.notice:
				return R.search.notice;
			case $url.apps.users:
				return R.search.users;
			default:
				return R.search.default;
		}
	}, [location.pathname]);

	return (
		<>
			<Row className='justify-content-between w-100'>
				{/* 검색 바 */}
				<Col>
					<InputSearch
						onClick={onClickSearch}
						placeholder={getSearchPlaceholder()}
					/>
				</Col>

				{/* 구독 버튼 */}
				<Col className='text-center me-auto'>
					<Button color='primary' onClick={() => setModal(true)}>
						{R.button.subscribe}
					</Button>
				</Col>
			</Row>

			{/* 구독 모달 */}
			{isModal && <ModalSubscribtion onClose={onClickSubscribe} />}
		</>
	);
};

export default SearchBar;
