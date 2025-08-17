// import { PageContainer } from '@features/common/ui/PageContainer.ui';
// import { styled } from '@styles/stitches.config';
// import Flex from '@entites/Flex';

// const StyledPage = styled(PageContainer, {
// 	'.contents-layer': {
// 		background: 'white',
// 	},
// });

// export const BucketlistPageMo = ({
// }: {
// }) => {

// 	return (
// 		<StyledPage >
// 			<Flex direction={'column'} flex={1}>
// 			</Flex>
// 		</StyledPage>
// 	);
// };

import React, { useMemo } from 'react';
import {
	CardContent,
	CardHeader,
	Typography,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Stack,
	Divider,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { Card } from '@entites/Card';

// --- Types
export type Params = {
	principal: number; // 원금
	rate: number; // 연 이율 (예: 0.15)
	years: number; // 투자 기간 (년)
	annualContribution: number; // 매년 추가 투자액 (연말)
};

export type YearRow = {
	year: number; // 1..N
	start: number; // 연초 금액
	afterGrowth: number; // 이자 적용 후
	contribution: number; // 연말 추가액
	end: number; // 연말 총액
	end_noContrib: number; // 추가 투자 없는 경우의 연말 총액 (비교용)
	interestEarned: number; // 해당 연도에 발생한 이자 (contrib 포함 케이스 기준)
};

// --- KRW formatter
const fmtKRW = (v: number) =>
	new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(v);

// --- Core calculator: end-of-year contribution (연말 납입)
const buildSchedule = ({ principal, rate, years, annualContribution }: Params): YearRow[] => {
	const rows: YearRow[] = [];
	let bal = principal; // with contribution case
	let balNo = principal; // without contribution

	for (let y = 1; y <= years; y++) {
		const start = bal;
		const afterGrowth = start * (1 + rate);
		const end = afterGrowth + annualContribution; // 연말 납입

		// no-contribution path
		balNo = balNo * (1 + rate);

		const row: YearRow = {
			year: y,
			start,
			afterGrowth,
			contribution: annualContribution,
			end,
			end_noContrib: balNo,
			interestEarned: afterGrowth - start,
		};

		rows.push(row);
		bal = end; // 다음 해로 이월
	}

	return rows;
};

// --- Mock Inputs (프론트 입력을 받은 것으로 가정)
const mockParams: Params = {
	principal: 40_000_000,
	rate: 0.15,
	years: 10,
	annualContribution: 5_000_000,
};

// --- Chart data shape
type ChartRow = { year: number; withContrib: number; withoutContrib: number };

const useChartData = (rows: YearRow[]) =>
	rows.map<ChartRow>((r) => ({ year: r.year, withContrib: r.end, withoutContrib: r.end_noContrib }));

// --- Small summary cards
const Summary = ({ rows, params }: { rows: YearRow[]; params: Params }) => {
	const final = rows[rows.length - 1];
	const totalInvested = params.principal + params.annualContribution * rows.length;
	const gain = final.end - totalInvested;

	return (
		<Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
			<Card className='shadow-md rounded-2xl' sx={{ flex: 1 }}>
				<CardHeader title='최종 평가액 (추가 투자 포함)' />
				<CardContent>
					<Typography variant='h4' fontWeight={700}>
						{fmtKRW(final.end)}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						기간: {params.years}년, 연 {Math.round(params.rate * 100)}% 복리
					</Typography>
				</CardContent>
			</Card>
			<Card className='shadow-md rounded-2xl' sx={{ flex: 1 }}>
				<CardHeader title='순이익 (평가액 - 총 납입)' />
				<CardContent>
					<Typography variant='h4' fontWeight={700}>
						{fmtKRW(gain)}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						총 납입: {fmtKRW(totalInvested)}
					</Typography>
				</CardContent>
			</Card>
			<Card className='shadow-md rounded-2xl' sx={{ flex: 1 }}>
				<CardHeader title='추가 투자 없이' />
				<CardContent>
					<Typography variant='h6'>최종액: {fmtKRW(final.end_noContrib)}</Typography>
					<Typography variant='body2' color='text.secondary'>
						(비교용)
					</Typography>
				</CardContent>
			</Card>
		</Stack>
	);
};

// --- Chart
const GrowthChart = ({ data }: { data: ChartRow[] }) => (
	<Box sx={{ width: '100%', height: 360 }}>
		<ResponsiveContainer>
			<LineChart data={data} margin={{ top: 12, right: 24, bottom: 12, left: 0 }}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='year' tickFormatter={(v) => `${v}년`} />
				<YAxis tickFormatter={(v) => `${Math.round(v / 1_0000_0000)}억`} />
				<Tooltip formatter={(v: number) => fmtKRW(v)} labelFormatter={(l) => `${l}년`} />
				<Legend />
				<Line type='monotone' dataKey='withContrib' name='추가 투자 포함' strokeWidth={2} dot={false} />
				<Line type='monotone' dataKey='withoutContrib' name='추가 투자 없음' strokeWidth={2} dot={false} />
			</LineChart>
		</ResponsiveContainer>
	</Box>
);

// --- Table
const ResultTable = ({ rows }: { rows: YearRow[] }) => (
	<TableContainer component={Paper} sx={{ borderRadius: 2 }}>
		<Table size='small'>
			<TableHead>
				<TableRow>
					<TableCell align='center'>연도</TableCell>
					<TableCell align='right'>연초 금액</TableCell>
					<TableCell align='right'>15% 적용 후</TableCell>
					<TableCell align='right'>추가금</TableCell>
					<TableCell align='right'>연말 총액</TableCell>
					<TableCell align='right'>(비교) 추가 없음</TableCell>
					<TableCell align='right'>당해 이자</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((r) => (
					<TableRow key={r.year} hover>
						<TableCell align='center'>{r.year}</TableCell>
						<TableCell align='right'>{fmtKRW(r.start)}</TableCell>
						<TableCell align='right'>{fmtKRW(r.afterGrowth)}</TableCell>
						<TableCell align='right'>{fmtKRW(r.contribution)}</TableCell>
						<TableCell align='right'>
							<b>{fmtKRW(r.end)}</b>
						</TableCell>
						<TableCell align='right'>{fmtKRW(r.end_noContrib)}</TableCell>
						<TableCell align='right'>{fmtKRW(r.interestEarned)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

const StyledPage = styled(Flex, {
	'&.bucket': {
		height: '100vh',
		overflowY: 'auto',
	},
});

// --- Main demo component (replace mockParams with 실제 입력값 props 연결)
export const BucketlistPageMo: React.FC = () => {
	// 실제로는 props나 form 값으로 params를 받아오면 됩니다.
	const params = mockParams;

	const rows = useMemo(() => buildSchedule(params), [params]);
	const chartData = useMemo(() => useChartData(rows), [rows]);

	return (
		<StyledPage gap={4} direction={'column'} className={clsx('bucket p-4')}>
			<Flex direction={'column'} gap={4}>
				<Typography variant='h5' fontWeight={800}>
					복리 + 연말 추가 투자 시뮬레이션 (Mock)
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					입력값을 프론트에서 이미 받았다고 가정하고, 동일 구조로 데이터를 생성해 그래프/테이블에 바인딩한 데모입니다.
					(납입 타이밍: 연말)
				</Typography>

				<Summary rows={rows} params={params} />

				<Card className='shadow-md rounded-2xl'>
					<CardHeader title='자산 성장 곡선' subheader='추가 투자 포함 vs 미포함' />
					<CardContent>
						<GrowthChart data={chartData} />
					</CardContent>
				</Card>

				<Card className='shadow-md rounded-2xl'>
					<CardHeader title='연도별 상세' />
					<CardContent>
						<ResultTable rows={rows} />
					</CardContent>
				</Card>

				<Divider />
				<Box>
					<Typography variant='overline' color='text.secondary'>
						입력(Mock)
					</Typography>
					<Typography variant='body2'>
						원금: {fmtKRW(params.principal)} / 연이율: {Math.round(params.rate * 100)}% / 기간: {params.years}년 / 연말
						추가: {fmtKRW(params.annualContribution)}
					</Typography>
				</Box>
			</Flex>
		</StyledPage>
	);
};
