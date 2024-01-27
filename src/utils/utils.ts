// 객체에 대한 깊은 비교 함수
export const isEqualObject = (a: Object, b: Object) => {
	return Object.entries(a).toString() === Object.entries(b).toString();
};

// TODO : 배열 객체에 대한 깊은 비교 함수(추후 로직 가능성 있음)
export const isEqualArray = (a: Array<undefined>, b: Array<undefined>) => {
	return JSON.stringify(a) === JSON.stringify(b);
};

// JOSON 데이터에 대한 비교 함수
export const isEqualJson = (
	a: { [key: string]: string | number },
	b: { [key: string]: string | number }
) => {
	return JSON.stringify(a) === JSON.stringify(b);
};

export const randomNum = (max = 10, min = 1) => {
	return Math.floor(Math.random() * (max + 1)) + min;
};

export const toObjectKeys = <T extends Object>(obj: T): Array<keyof T> =>
	Object.keys(obj) as Array<keyof T>;

export const sortByObjectKey = (
	array: Array<Record<string, string>>,
	sortkey: string,
	isAcs: boolean = true
) => {
	if (isAcs) {
		return array.sort((a, b) => {
			if (Number.isInteger(a[sortkey]) && Number.isInteger(b[sortkey])) {
				return Number(a[sortkey]) - Number(b[sortkey]);
			} else {
				return (a[sortkey] as string) > (b[sortkey] as string) ? 1 : -1;
			}
		});
	} else {
		return array.sort((a, b) => {
			if (Number.isInteger(b[sortkey]) && Number.isInteger(a[sortkey])) {
				return Number(b[sortkey]) - Number(a[sortkey]);
			} else {
				return (a[sortkey] as string) > (b[sortkey] as string) ? -1 : 1;
			}
		});
	}
};

export const commas = (value: number | string) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const valueOfBase64 = (
	file: File
): Promise<{ image: string; width: number; height: number }> => {
	return new Promise((resolve, reject) => {
		if (!file) return reject();

		try {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e: ProgressEvent<FileReader>) => {
				let img = new Image();
				img.src = e.target?.result as string;

				img.onload = () => {
					resolve({
						image: e.target?.result as string,
						width: img.width,
						height: img.height,
					});
				};
			};
			reader.onerror = (error) => {
				reject(error);
			};
		} catch (error) {
			reject(error);
		}
	});
};

export const filteredListItems = (
	list: Array<any> | null,
	searchKeyword?: string,
	selectedType?: string
) => {
	if (!list) return [];

	let temps: Array<any> = [...list];

	if (selectedType) {
		temps = temps.filter((a) => a.type === selectedType);
	}

	if (searchKeyword) {
		temps = temps.filter((a) => a.title.indexOf(searchKeyword) >= 0);
	}

	return temps;
};
