import { Input } from 'reactstrap';
import { MajorCareer as Major, MinorCareer as Minor } from '@/types/types';
import { IDropMenuItem } from './DropMenu';
import { forwardRef, useEffect, useState } from 'react';

const CareerSelect = forwardRef(
	(
		{
			type = 'major',
			onSelect,
			className,
			style,
			selected,
		}: {
			type: 'major' | 'minor';
			onSelect?: (vlaue: string, object?: IDropMenuItem) => void;
			className?: string;
			style?: object;
			selected?: string | null;
		},
		ref?: React.Ref<HTMLInputElement>
	) => {
		const selectList =
			type === 'major' ? Major().toSelectData() : Minor().toSelectData();

		const [selection, setSelection] = useState<string>(
			selectList[0].value as string
		);

		useEffect(() => {
			setSelection(selected || (selectList[0].value as string));
		}, [selected]);

		const onChange = (e: any) => {
			const label = (type === 'major' ? Major() : Minor()).get()[
				e?.target?.value
			];

			const value = e?.target?.value;
			setSelection(value);
			onSelect && onSelect(value, { label: label, value: e?.target?.value });
		};

		return (
			<Input
				type='select'
				className={className}
				onChange={onChange}
				style={style}
				innerRef={ref}
				value={selection}
			>
				{selectList.map((item) => {
					return (
						<option key={item.value} value={item.value}>
							{item.label}
						</option>
					);
				})}
			</Input>
		);
	}
);

export default CareerSelect;

// export const CareerSelectForm = ({
// 	major,
// 	minor,
// 	onChange,
// }: {
// 	major?: IDropMenuItem;
// 	minor?: IDropMenuItem;
// 	onChange: (major: IDropMenuItem | null, minor: IDropMenuItem | null) => void;
// }) => {
// 	const [majorCareer, setMajorCareer] = useState<IDropMenuItem | null>(
// 		major || null
// 	);
// 	const [minorCareer, setMinorCareer] = useState<IDropMenuItem | null>(
// 		minor || null
// 	);

// 	const onSelectMajor = (value: IDropMenuItem) => {
// 		setMajorCareer(value);
// 		onChange(value, minorCareer);
// 	};

// 	const onSelectMinor = (value: IDropMenuItem) => {
// 		setMinorCareer(value);
// 		onChange(majorCareer, value);
// 	};

// 	return (
// 		<>
// 			<CareerSelect
// 				type='major'
// 				className='mt-2'
// 				selected={majorCareer}
// 				onSelect={onSelectMajor}
// 				style={{ marginTop: '40px' }}
// 			/>

// 			<CareerSelect
// 				type='minor'
// 				className='mt-2'
// 				selected={minorCareer}
// 				onSelect={onSelectMinor}
// 				style={{ marginTop: '34px' }}
// 			/>
// 		</>
// 	);
// };
