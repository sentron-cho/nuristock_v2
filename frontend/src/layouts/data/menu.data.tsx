import { ST } from '@shared/config/kor.lang';
import { URL } from '@shared/config/url.enum';
import {
	IconAsset,
	IconBucket,
	IconDashboard,
	IconDeposit,
	IconDiary,
	IconDividend,
	IconInvest,
	IconSonic,
	IconStockSearch,
} from '@entites/Icons';

export const Menus = () => {
	const items = [
		// { value: URL.MAIN, label: ST.MENU.MAINBOARD, icon: <IconHome fontSize='small' /> }, // 메인
		{ value: URL.DASHBOARD, label: ST.MENU.DASHBOARD, icon: <IconDashboard fontSize='small' /> }, // 대시보드
		{ value: URL.DIARY, label: ST.MENU.DIARY, icon: <IconDiary fontSize='small' /> }, // 다이어리
		{ value: URL.PROFIT, label: ST.MENU.PROFIT, icon: <IconSonic fontSize='small' /> }, // 투자손익
		{ value: URL.INVEST, label: ST.MENU.INVEST, icon: <IconInvest fontSize='small' /> }, // 가치투자
		{ value: URL.BUCKET, label: ST.MENU.BUCKET, icon: <IconBucket fontSize='small' /> }, // 버킷리스트

		{ value: URL.DIVIDEND, label: ST.MENU.DIVIDEND, icon: <IconDividend fontSize='small' /> }, // 배당
		{ value: URL.ASSET, label: ST.MENU.ASSET, icon: <IconAsset fontSize='small' /> }, // 투자금
		{ value: URL.DEPOSIT, label: ST.MENU.DEPOSIT, icon: <IconDeposit fontSize='small' /> }, // 예수금
		{ value: URL.MARKET, label: ST.MENU.MARKET, icon: <IconStockSearch fontSize='small' /> }, // 종목검색
	];

	// if (isAll) {
	// 	items.push(
	// 		{ value: URL.DIVIDEND, label: ST.MENU.DIVIDEND, icon: <IconDividend fontSize='small' /> }, // 배당
	// 		{ value: URL.ASSET, label: ST.MENU.ASSET, icon: <IconAsset fontSize='small' /> }, // 투자금
	// 		{ value: URL.DEPOSIT, label: ST.MENU.DEPOSIT, icon: <IconDeposit fontSize='small' /> }, // 예수금
	// 		{ value: URL.MARKET, label: ST.MENU.MARKET, icon: <IconStockSearch fontSize='small' /> } // 종목검색
	// 	);
	// } else {
	// 	isMobile && items.push({ value: URL.MEMUS, label: ST.MENU.MORE, icon: <IconMoreHori fontSize='small' /> });
	// }

	return items;
};
