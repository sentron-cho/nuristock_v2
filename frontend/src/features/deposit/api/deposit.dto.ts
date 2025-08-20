export interface DepositItemType {
	rowid?: number;
	stype?: string;
	sdate: string;
	price: number;
	tax?: number;
}

export interface DepositResponse {
	value?: DepositItemType[];
}

export interface DepositCreateType extends DepositItemType {}
