import { fail, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { JWT_SECRET } from '$env/static/private'

export const jwtSecret = JWT_SECRET

/**
 * Get user info from json web token
 * @param token string
 * @returns User|null
 */
export const getUserInformation = (token: string): User | null => {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded.user;
    } catch (err) { }
    return null;
};


/**
 * return error for non-logged in users
 * @param code number
 * @param message string
 * @returns error
 */
export const returnUnauthenticated = (code = 403, message = "You need to be logged in!") => json({ message }, { status: code, statusText: message });

/**
 * return error for non-authorized  users
 * @param code number
 * @param message string
 * @returns error
 */
export const returnUnauthorized = (code = 403, message = "Unauthorized!") => json({ message }, { status: code, statusText: message });

/**
 * return error for form actions. Don't use on API
 * @param code number
 * @param message string
 * @returns error
 */
export const returnRespError = (error: any, code = 400) => fail(code, { success: false, errors: getValidationErrorMessages(error) });

/**
 * throw validation error from zod
 * @param errors array,object,string
 * @param code number default=422
 */
export const getValidationErrorMessages = (errors: ZodError | Error | string): string[] => {
    if (errors instanceof ZodError) {
        const arr: string[] = []
        errors.errors.forEach(e => {
            arr.push(`${e.path[0]} - ${e.message}`)
        })
        return arr;
    }

    if (Array.isArray(errors)) {
        const arr: string[] = []
        errors.forEach(e => arr.push(e))
        return arr;
    }

    return [errors.toString()]
}
