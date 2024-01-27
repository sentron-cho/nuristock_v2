import * as Yup from 'yup';
import { validstr as str } from '@/langs/common.langs';

export const valid = {
	required: (label: string) => Yup.string().required(label),
	userName: Yup.string().required(str.name.required),
	name: Yup.string().required(str.name.required),
	email: Yup.string().email(str.email.format).required(str.email.required),

	password: (isRequired = true) => {
		const ret = Yup.string()
			.min(8, str.password.format)
			.max(15, str.password.format)
			.matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/, str.password.format);

		if (isRequired) {
			return ret.required(str.password.required);
		} else {
			return ret;
		}
	},

	passwordCheck: (targetName = 'passowrd', isRequired = true) => {
		const ret = Yup.string()
			.min(8, str.password.format)
			.max(15, str.password.format)
			.matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/, str.password.format)
			.oneOf([Yup.ref(targetName), ''], str.password.check);

		if (isRequired) {
			return ret.required(str.password.required);
		} else {
			return ret;
		}
	},

	checkCode: Yup.string().required(str.code.required),
};
