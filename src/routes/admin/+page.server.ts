import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const rooms = await prisma.room.findMany({
        include: {
            _count: {
                select: {
                    messages: true,
                    roomUsers: true,
                },
            },
        },
    })

    const messages = await prisma.message.groupBy({
        by: ['userId'],
        _count: {
            userId: true,
        },
        orderBy: {
            _count: {
                userId: 'desc',
            }
        },
        take: 5,
    })

    const userIds = messages.reduce((p, n) => { p.push(n.userId); return p }, [])

    const users = prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            name: true,
            id: true,
        }
    })

    return {
        rooms,
        messages,
        users,
        user: locals.user
    };

};