import { useCreateAppConfig, useDeleteAppConfig, useSelectAppConfig, useUpdateAppConfig } from '@shared/api/app.api';
import { AppConfigDataType } from '@shared/api/app.dto';
import { useMemo } from 'react';

export const useAppConfigHook = ({ group }: { group?: string }) => {
	const { data, isPending } = useSelectAppConfig({ group });
	const list = useMemo(() => data?.value, [data]);

	const { mutateAsync: useCreate } = useCreateAppConfig();
	const { mutateAsync: useDelete } = useDeleteAppConfig();
	const { mutateAsync: useUpdate } = useUpdateAppConfig();

	const createConfig = (data?: AppConfigDataType) => {
		let params = { ...data, sgroup: data?.sgroup || group } as AppConfigDataType;
		useCreate(params);
	};

	const removeConfig = (rowid?: number) => {
		if (!rowid) return;

		useDelete(rowid);
	};

	const updateConfig = (data?: AppConfigDataType) => {
		if (!data?.rowid) return;

		let params = { ...data, sgroup: data?.sgroup || group } as AppConfigDataType;
		useUpdate(params);
	};

	const getConfig = (key: string) => {
		return list?.find((a) => a.skey === key)?.svalue;
	};

	return {
		isPending,
		data: list,
		getConfig,
		createConfig,
		removeConfig,
		updateConfig,
	};
};
