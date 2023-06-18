import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: { messages: true },
            },
        },
    })

    return {
        users,
    };
};