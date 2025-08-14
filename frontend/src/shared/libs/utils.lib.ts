import { EID } from '@shared/config/default.config';
import { SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';

export enum COST {
	JO = '조',
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
	if (num > 99999999999) {
		// 조원 ~
		return { value: (num / 1000000000000).toFixed(1), unit: `${COST.JO}${COST.WON}` };
	} else if (num > 99999999) {
		// 억원 ~
		return { value: (num / 100000000).toFixed(1), unit: `${COST.EUK}${COST.WON}` };
	} else if (num > 9999999) {
		// 천만원 ~ 억원
		return { value: Math.ceil(num / 10000000), unit: `${COST.CHEN}${COST.MAN}${COST.WON}` };
	} else if (num > 9999) {
		// 만원 ~ 백만원
		return { value: Math.ceil(num / 10000), unit: `${COST.MAN}${COST.WON}` };
	} else {
		return { value: withCommas(v), nuit: '' };
	}
};

// export const toShortCostUnit = (v?: number | string) => {
// 	let num = Number(v);
// 	if (num > 99999999999) {
// 		// 조원 ~
// 		return `${COST.JO}${COST.WON}`;
// 	} else if (num > 99999999) {
// 		// 억원 ~
// 		return `${COST.EUK}${COST.WON}`;
// 	} else if (num > 9999999) {
// 		// 천만원 ~ 억원
// 		return `${COST.CHEN}${COST.MAN}${COST.WON}`;
// 	} else if (num > 9999) {
// 		// 만원 ~ 백만원
// 		return `${COST.MAN}${COST.WON}`;
// 	} else {
// 		return `${COST.WON}`;
// 	}
// };

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

// 9%와 같은 값을 0.09와 같은 백분율 숫자로 치환
export const percentToDecimal = (percent: string | number): number => {
	if (typeof percent === 'string') {
		// 공백 제거 + % 제거 후 숫자로 변환
		return parseFloat(percent.replace('%', '').trim()) / 100;
	}

	return percent / 100;
};

/**
 * 문자열에서 숫자만 추출하여 number로 반환
 * - 소수점 하나만 허용
 * - 음수 부호 허용
 * - 없으면 NaN 반환
 */
export const toNumeric = (value: string | number): number => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;

  const numericString = value
    .replace(/[^0-9.-]/g, "")     // 숫자, 마이너스, 소수점만 허용
    .replace(/(?!^)-/g, "")       // 맨 앞이 아닌 '-' 제거
    .replace(/(\..*)\./g, "$1");  // 소수점 두 번 이상이면 뒤 제거

  return parseFloat(numericString);
};
