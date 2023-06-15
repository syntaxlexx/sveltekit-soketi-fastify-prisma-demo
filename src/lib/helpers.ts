import { ZodError } from 'zod';
import { fail } from '@sveltejs/kit';

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

    if (Array.isArray(errors)) {
        const arr: string[] = []
        errors.forEach(e => arr.push(snakeCaseToSentenceCaseCapitalizeWords(e)))
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
