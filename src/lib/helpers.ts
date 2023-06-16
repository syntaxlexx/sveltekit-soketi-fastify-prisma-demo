import { ZodError } from 'zod';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const customResponse = (status: number, success: boolean, message: string, data?: any) => {
    if (success) {
        return {
            success: success,
            message: message,
            info: data
        };
    }

    return fail(status, {
        success: success,
        message: message,
        errors: data
    });
};

export const convertToJson = (data: object | Array<any>) => {
    return JSON.parse(JSON.stringify(data));
};


/**
 * throw validation error from zod
 * @param errors array,object,string
 * @param code number default=422
 */
export const getValidationErrorMessages = (errors: ZodError | Error | string | string[]): string[] => {
    if (errors instanceof ZodError) {
        const arr: string[] = []
        errors.errors.forEach(e => {
            arr.push(`${e.path[0]} - ${e.message}`)
        })
        return arr;
    }

    console.log("errors", errors);

    if (Array.isArray(errors)) {
        const arr: string[] = []
        errors.forEach(e => arr.push(snakeCaseToSentenceCaseCapitalizeWords(e)))
        return arr;
    }

    if (typeof errors === 'object') {
        const arr: string[] = []
        Object.values(errors).forEach(e => {
            arr.push(e)
        })
        return arr;
    }

    return [errors.toString()]
}


/**
 * convert snake case to sentence case, capitalizing all words
 * eg 'your_string' => 'Your String'
 */
export const snakeCaseToSentenceCaseCapitalizeWords = (value: string | null) => {
    if (!value) return "";
    value = value.replace(/(_)/g, " ");
    return value.replace(/\b\w/g, function (l) {
        return l.toUpperCase();
    });
};


/**
 * return 24-hour time from an  ISO 8601  date
 * @param date string
 * @returns string
 */
export const getTimeFromDate = (date: string | Date) => {
    return dayjs(date).format('HH:mm');
};


// date => 2 days ago
export const fromNow = (date: Date | null | undefined) => {
	if (!date) return "";
	return dayjs(date).fromNow(); // { addSuffix: true }
};

// date => 22nd Jun 2021, 2:00 pm
// https://day.js.org/docs/en/display/format
export const dateFormat = (date: Date | null | undefined, dateFormat = "MMM D, YYYY h:mm A") => {
	if (!date) return "";
	return dayjs(date).format(dateFormat);
};
