import { MyStockResponse, MyStockSiseResponse } from './mystock.dto';
import { mock as mockData } from './mock/mystock.list';
import { mock as mockSise } from './mock/mystock.sise';
import { useQuery } from '@tanstack/react-query';

export const useSelectMyStock = (code?: string) => {
	return useQuery<unknown, Error, MyStockResponse>({
		queryKey: ['MYSTOCK-R01'],
		queryFn: () => mockData,
	});
};

export const useSelectMyStockSise = (code?: string) => {
	return useQuery<unknown, Error, MyStockSiseResponse>({
		queryKey: ['MYSTOCK-R02'],
		queryFn: () => mockSise,
	});
};
