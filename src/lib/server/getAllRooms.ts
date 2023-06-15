import prisma from "$lib/prisma"

const getAllRooms = async () => {
    const rooms = await prisma.room.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
    return rooms;
}

export default getAllRooms