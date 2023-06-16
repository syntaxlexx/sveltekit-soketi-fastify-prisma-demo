import { ZodError } from 'zod';

/**
 * return error for form actions. Don't use on API
 * @param code number
 * @param message string
 * @returns object
 */
const returnRespError = (error, code = 400) => {
	return { success: false, errors: getValidationErrorMessages(error) };
};

/**
 * throw validation error from zod
 * @param errors array,object,string
 * @param code number default=422
 */
const getValidationErrorMessages = (errors) => {
	if (errors instanceof ZodError) {
		const arr = [];
		errors.errors.forEach((e) => {
			arr.push(`${e.path[0]} - ${e.message}`);
		});
		return arr;
	}

	if (Array.isArray(errors)) {
		const arr = [];
		errors.forEach((e) => arr.push(e));
		return arr;
	}

	return [errors.toString()];
};

module.exports = {
	returnRespError,
	getValidationErrorMessages
};
