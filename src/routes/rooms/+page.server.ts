import prisma from '$lib/prisma';
import { returnRespError, returnUnauthenticated } from '$lib/server/helpers';
import type { Actions } from './$types';
import z from 'zod'

export async function load({ cookies }) {
    const rooms = await prisma.room.findMany({
        where: {
            name: {
                not: 'Public'
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return {
        rooms,
        accessToken: cookies.get('session')
    };
}

export const actions = {
    create: async ({ request, locals }) => {
        const user = locals.user

        if (!user) {
            return returnUnauthenticated();
        }

        const data = Object.fromEntries(await request.formData())

        const validated = z.object({
            name: z.string().trim().min(3).max(40),
            is_group: z.coerce.boolean().nullable()
        }).safeParse(data)

        if (!validated.success) {
            return returnRespError(validated.error);
        }

        try {
            const room = await prisma.room.create({
                data: {
                    name: validated.data.name,
                    userId: user.id,
                    isGroup: Boolean(validated.data.is_group),
                }
            });

            await prisma.roomUser.create({
                data: {
                    userId: user.id,
                    roomId: room.id,
                }
            });

            return {
                success: true,
                message: 'Room created'
            }

        } catch (error) {
            console.log('error', error);
            return returnRespError(error?.message);
        }

    },
} satisfies Actions
