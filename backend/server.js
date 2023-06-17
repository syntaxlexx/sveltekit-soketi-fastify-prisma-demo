import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import fastifyEnv from '@fastify/env';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors';
import Pusher from 'pusher';
import { z, ZodError } from 'zod';
import jwt from 'jsonwebtoken';

const accessTokenHeader = 'x-access-token';

/**
 * return error for form actions. Don't use on API
 * @param error string|null|object
 * @param message string|null
 * @param code number
 * @returns object
 */
const formatRespError = (error, message = null, code = 400) => {
	return {
		status: code,
		success: false,
		errors: getValidationErrorMessages(error),
		message
	};
};

const formatUnauthenticatedError = () => {
	return formatRespError({ message: 'You need to be logged in' }, 'Unauthenticated', 401);
};

const formatUnauthorizedError = () => {
	return formatRespError(
		{ message: 'You are not allowed to perform that action' },
		'Unauthorized',
		401
	);
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
			arr.push(`${e.path[0] ?? ''} - ${e.message}`);
		});
		return arr;
	}

	if (Array.isArray(errors)) {
		const arr = [];
		errors.forEach((e) => arr.push(e));
		return arr;
	}

	if (typeof errors === 'object') return errors;

	return [errors.toString()];
};

const fastify = Fastify({
	logger: true
});

const prisma = new PrismaClient();

// configure env
const envSchema = {
	type: 'object',
	required: [
		'PUSHER_APP_ID',
		'PUSHER_APP_KEY',
		'PUSHER_APP_SECRET',
		'PUSHER_PORT',
		'BACKEND_PORT',
		'JWT_SECRET'
	],
	properties: {
		PUSHER_APP_ID: {
			type: 'string',
			default: ''
		},
		PUSHER_APP_KEY: {
			type: 'string',
			default: ''
		},
		PUSHER_APP_SECRET: {
			type: 'string',
			default: ''
		},
		PUSHER_PORT: {
			type: 'string',
			default: 6001
		},
		BACKEND_PORT: {
			type: 'string',
			default: 6001
		},
		JWT_SECRET: {
			type: 'string',
			default: ''
		}
	}
};

const envOptions = {
	confKey: 'config',
	dotenv: true,
	schema: envSchema,
	data: process.env
};

fastify.register(fastifyEnv, envOptions);
fastify.register(fastifyFormbody);

// register helmet
fastify.register(
	helmet,
	// Example disables the `contentSecurityPolicy` middleware but keeps the rest.
	{ contentSecurityPolicy: false }
);

fastify.register(cors, {
	origin: (origin, cb) => {
		const hostname = new URL(origin).hostname;
		if (hostname === 'localhost') {
			//  Request from localhost will pass
			cb(null, true);
			return;
		}

		// Generate an error on other origins, disabling access
		cb(new Error('Not allowed'), false);
	}
});

// finally await all initialisations
await fastify;

// console.log(fastify.config);

const getUserInformation = (token) => {
	try {
		const decoded = jwt.verify(token, fastify.config.JWT_SECRET);
		return decoded.user;
	} catch (err) {}
	return null;
};

// Pusher config
var pusher = new Pusher({
	appId: fastify.config.PUSHER_APP_ID,
	key: fastify.config.PUSHER_APP_KEY,
	secret: fastify.config.PUSHER_APP_SECRET,
	// cluster: 'local',
	host: '127.0.0.1',
	port: fastify.config.PUSHER_PORT,
	scheme: 'http',
	// encrypted: true,
	useTLS: false,
	encryptionMasterKeyBase64: 'cG9zdG93bnNlcGFyYXRld2l0aGluc3RyZXRjaGJhc2U=' // 'openssl rand -base64 32'
});

// Declare a route
fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

fastify.get('/ping', async (request, reply) => {
	pusher.trigger('chat-room', 'new-message', {
		message: 'hello-world'
	});

	return { pong: 'it worked!' };
});

// CRUD
fastify.get('/public-latest-messages', async (request, reply) => {
	const data = await prisma.message.findMany({
		include: {
			user: {
				select: {
					name: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 5
	});
	return { data };
});

fastify.post('/public', async (request, reply) => {
	const accessToken = request.headers[accessTokenHeader];
	if (!accessToken) {
		throw formatUnauthenticatedError();
	}
	const user = getUserInformation(accessToken);
	if (!user) {
		throw formatUnauthenticatedError();
	}

	const data = JSON.parse(request.body);

	const validated = z
		.object({
			message: z.string().trim().min(1).max(255)
		})
		.safeParse(data);

	if (!validated.success) {
		throw formatRespError(validated.error, 'Validation errors');
	}

	let room = await prisma.room.findFirst({
		where: {
			name: 'Public'
		}
	});

	if (!room) {
		room = await prisma.room.create({
			data: {
				name: 'Public',
				userId: user.id
			}
		});
	}

	const message = await prisma.message.create({
		data: {
			userId: user.id,
			roomId: room.id,
			message: validated.data.message
		},
		include: {
			user: {
				select: {
					name: true
				}
			}
		}
	});

	pusher.trigger('chat-room', 'new-message', {
		message
	});

	return { success: true, message };
});

fastify.post('/message', async (request, reply) => {
	const accessToken = request.headers[accessTokenHeader];
	if (!accessToken) {
		throw formatUnauthenticatedError();
	}
	const user = getUserInformation(accessToken);
	if (!user) {
		throw formatUnauthenticatedError();
	}

	const data = JSON.parse(request.body);

	const validated = z
		.object({
			message: z.string().trim().min(1).max(255),
			roomId: z.coerce.number()
		})
		.safeParse(data);

	if (!validated.success) {
		throw formatRespError(validated.error, 'Validation errors');
	}

	// verify user can post in the room
	const roomId = validated.data.roomId;
	const roomUser = await prisma.roomUser.findFirst({
		where: {
			userId: user.id,
			roomId: roomId
		}
	});

	if (!roomUser) throw formatUnauthorizedError();

	const room = await prisma.room.findFirst({
		where: {
			id: roomId
		}
	});

	if (!room) {
		throw formatRespError({ message: 'Room not found!' }, null, 404);
	}

	const message = await prisma.message.create({
		data: {
			userId: user.id,
			roomId: room.id,
			message: validated.data.message
		},
		include: {
			user: {
				select: {
					name: true
				}
			}
		}
	});

	// alert subs
	if (room.isGroup) {
		pusher.trigger(`presence-room-${room.id}`, 'new-message', {
			message
		});
	} else {
		pusher.trigger(`private-room-${room.id}`, 'new-message', {
			message
		});
	}

	return { success: true, message };
});

fastify.get('/room/:id/latest-messages', async (request, reply) => {
	const roomId = Number(request.params.id);

	const data = await prisma.message.findMany({
		where: {
			roomId: roomId
		},
		include: {
			user: {
				select: {
					name: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 20
	});
	return { data };
});

fastify.get('/room/:id/typing', async (request, reply) => {
	const accessToken = request.headers[accessTokenHeader];
	if (!accessToken) {
		throw formatUnauthenticatedError();
	}
	const user = getUserInformation(accessToken);
	if (!user) {
		throw formatUnauthenticatedError();
	}

	const roomId = Number(request.params.id);
	const isPrivate = Boolean(request.query['is-private']);
	console.log('isPrivate', isPrivate);

	// alert subs
	const channelName = isPrivate ? `private-room-${roomId}` : `presence-room-${roomId}`;
	pusher.trigger(channelName, 'typing', {
		user: {
			id: user?.id,
			name: user?.name
		}
	});

	return { success: true };
});

// pusher authentication
fastify.post('/pusher/auth', async (request, reply) => {
	// first verify they are logged in!
	const accessToken = request.headers[accessTokenHeader];
	if (!accessToken) {
		throw formatUnauthenticatedError();
	}
	const user = getUserInformation(accessToken);
	if (!user) {
		throw formatUnauthenticatedError();
	}

	// now verify if they are a participant of the room
	const socketId = request.body.socket_id;
	const channel = request.body.channel_name;

	if (channel.startsWith('private-room')) {
		try {
			const roomId = Number(channel.split('-').pop());
			const roomUser = await prisma.roomUser.findFirst({
				where: {
					userId: user.id,
					roomId: roomId
				}
			});

			if (roomUser) {
				const authResponse = pusher.authorizeChannel(socketId, channel);
				return authResponse;
			}
		} catch (error) {
			return false;
		}
	}

	if (channel.startsWith('presence-room')) {
		try {
			const roomId = Number(channel.split('-').pop());
			const roomUser = await prisma.roomUser.findFirst({
				where: {
					userId: user.id,
					roomId: roomId
				}
			});

			if (roomUser) {
				const presenceData = {
					user_id: user.id,
					user_info: {
						name: user.name,
						id: user.id
					}
				};

				const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
				return authResponse;
			}
		} catch (error) {
			return false;
		}
	}

	return false;
});

/**
 * Run the server!
 */
const start = async () => {
	try {
		await fastify.listen({ port: fastify.config.BACKEND_PORT });
	} catch (err) {
		fastify.log.error(err);
		await prisma.$disconnect();
		process.exit(1);
	}
};

start();
