import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod'
import stringHash from 'string-hash';
import type { User } from '@prisma/client';
import prisma from '$lib/prisma';
import jwt from 'jsonwebtoken';
import { jwtSecret, returnRespError } from '$lib/server/helpers';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/');
    }
};

export const actions = {
    login: async ({ request, cookies }) => {
        const data = Object.fromEntries(await request.formData())

        const validated = z.object({
            email: z.string().trim().email(),
            password: z.string().trim().min(3).max(20),
        }).safeParse(data)

        if (!validated.success) {
            return returnRespError(validated.error);
        }

        let user: User | null | undefined = undefined;
        let token = null;

        try {
            user = await prisma.user.findFirst({
                where: {
                    email: validated.data.email
                }
            })

            if (!user) {
                throw new Error('Account not found');
            }

            if (user?.password != stringHash(validated.data.password).toString()) {
                throw new Error('Password error');
            }

            // generate token
            token = jwt.sign(
                {
                    user
                },
                jwtSecret,
                { expiresIn: '1d' }
            );

        } catch (error) {
            console.log('error', error);
            return returnRespError('You entered the wrong credentials.');
        }

        cookies.set('session', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 // 1 day
        });

        throw redirect(307, '/');
    },

    logout: async ({ cookies }) => {
        console.log('logging out');
        cookies.delete('session');
        throw redirect(307, '/');
    }
} satisfies Actions