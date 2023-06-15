import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod'
import stringHash from 'string-hash';
import type { User } from '@prisma/client';
import prisma from '$lib/prisma';
import { returnRespError } from '$lib/server/helpers';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/');
    }
};

export const actions = {
    register: async ({ request }) => {
        const data = Object.fromEntries(await request.formData())

        const validated = z.object({
            email: z.string().trim().email(),
            name: z.string().trim().min(3).max(20).nullable(),
            password: z.string().trim().min(3).max(20),
            confirm_password: z.string().trim().min(3).max(20),
        }).safeParse(data)

        if (!validated.success) {
            return returnRespError(validated.error);
        }

        if (validated.data.password != validated.data.confirm_password) {
            return returnRespError("Passwords do not match!");
        }

        try {
            const user = await prisma.user.findFirst({ where: { email: validated.data.email } });

            if (user) {
                throw new Error('That email has already been taken!');
            }

            await prisma.user.create({
                data: {
                    name: validated.data.name,
                    email: validated.data.email,
                    password: stringHash(validated.data.password).toString(),
                }
            });

        } catch (error) {
            console.log('error', error);
            return returnRespError(error?.message);
        }

        throw redirect(307, '/login');
    },
} satisfies Actions