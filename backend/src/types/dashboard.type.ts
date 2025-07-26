export interface DashboardCreateType {
  code: string;
	sise: number;
  updown: string;
  name?: string;
}

export interface DashboardSearchParams {
	rowid?: number;
	code: string;
	sdate: string;
	scost: number;
	count: number;
}
