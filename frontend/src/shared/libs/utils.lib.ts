import { EID } from '@shared/config/default.config';
import { SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';

export enum COST {
	EUK = '억',
	MAN = '만',
	WON = '원',
	CHEN = '천',
}

// export const withoutCommas = (v?: string) => {
//   return v?.toString()?.replace(/,/gi, '');
// }

export const valueOfPlusMinus = (a: number = 0, b: number = 0) => {
	return a === b ? EID.NONE : a < b ? EID.MINUS : EID.PLUS;
};

export const valueOfUpDown = (a: number = 0, b: number = 0) => {
	return a === b ? '' : a < b ? EID.DOWN : EID.UP;
};

export const withCommas = (v?: number | string, isRemove?: boolean) => {
	if (isRemove) {
		let temp = v?.toString()?.replace(/,/gi, '');
		[COST.CHEN, COST.MAN, COST.WON, COST.CHEN].forEach((a) => (temp = temp?.replace(a, '')));
		return temp;
	} else {
		return !v ? '' : v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
};

export const toNumber = (v?: string) => {
	return withCommas(v, true);
};

export const toCost = (v?: number | string, showZero?: boolean) => {
	if (showZero) return `${v ? withCommas(v) : 0} ${COST.WON}`;
	return `${withCommas(v)} ${COST.WON}`;
};

export const toShortCost = (v?: number | string) => {
	let num = Number(v);

	if (num > 99999999) {
		// 억원 ~
		return Math.ceil(num / 100000000) + `${COST.EUK}${COST.WON}`;
	} else if (num > 9999999) {
		// 천만원 ~ 억원
		return Math.ceil(num / 10000000) + `${COST.CHEN}${COST.MAN}${COST.WON}`;
	} else if (num > 9999) {
		// 만원 ~ 백만원
		return Math.ceil(num / 10000) + `${COST.MAN}${COST.WON}`;
	} else {
		return withCommas(v);
	}
};

export const getCostColorType = (value?: string | number) => {
	const number = Number(value);

	if (!value || number === 0) return 'none';
	else if (number > 0) return 'plus';
	else return 'minus';
};

export const sortDirections = (type: 'asc' | 'desc'): SortOrder[] => {
	if (type === 'asc') {
		return ['ascend', 'descend', 'ascend'];
	} else {
		return ['descend', 'ascend', 'descend'];
	}
};

export const valueOfDateDiff = (start?: string | Date, end?: string | Date): string => {
	if (!start || !end) return '';

	// 유효성 검사
	const startDate = dayjs(start);
	const endDate = dayjs(end);

	if (!startDate.isValid()) {
		console.warn('잘못된 날짜 형식!', { start });
		return '';
	}

	if (!endDate.isValid()) {
		console.warn('잘못된 날짜 형식!', { end });
		return '';
	}

	// 날짜 차이 계산 (절댓값)
	const diffDays = Math.abs(endDate.diff(startDate, 'day'));
	const years = Math.floor(diffDays / 365);
	const days = diffDays % 365;

	return `${years > 0 ? `${years}년 ` : ''}${days}일`;
};

// 오늘 일자가 주말인지 체크
export const isWeekend = (date?: string | Date): boolean => {
	const day = dayjs(date).toDate().getDay();
	return day === 0 || day === 6;
};

// 날자로 요일 가져오기
export const valueOfweek = (date?: string | Date): string => {
	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
	const day = dayjs(date).toDate().getDay();
	return weekDays[day];
};
