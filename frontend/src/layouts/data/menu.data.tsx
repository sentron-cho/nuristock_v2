import { ST } from '@shared/config/kor.lang';
import { URL } from '@shared/config/url.enum';
import { IconDiary, IconDividend, IconHome, IconInvest, IconMoreHori, IconSonic, IconStockSearch } from '@entites/Icons';

export const Menus = (isAll = false, isMobile  = false) => {
	const items = [
		{ value: URL.DASHBOARD, label: ST.MENU.DASHBOARD, icon: <IconHome fontSize='small' /> },
		{ value: URL.DIARY, label: ST.MENU.DIARY, icon: <IconDiary fontSize='small' /> },
		{ value: URL.PROFIT, label: ST.MENU.PROFIT, icon: <IconSonic fontSize='small' /> },
		{ value: URL.DIVIDEND, label: ST.MENU.DIVIDEND, icon: <IconDividend fontSize='small' /> },
		{ value: URL.INVEST, label: ST.MENU.INVEST, icon: <IconInvest fontSize='small' /> },
		// { value: URL.MARKET, label: ST.MENU.MARKET, icon: <IconStockSearch fontSize='small' /> },
	];

	if (isAll) {
		items.push(
			{ value: URL.MARKET, label: ST.MENU.MARKET, icon: <IconStockSearch fontSize='small' /> }
		);
	} else {
		isMobile && items.push(
			{ value: URL.MEMUS, label: ST.MENU.MORE, icon: <IconMoreHori fontSize='small' /> }
		)
	}

	return items;
};
