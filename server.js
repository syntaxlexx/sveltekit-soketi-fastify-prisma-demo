import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import fastifyEnv from '@fastify/env';
import cors from '@fastify/cors';
import Pusher from 'pusher-js';

const fastify = Fastify({
	logger: true
});

const prisma = new PrismaClient();

// configure env
const envSchema = {
	type: 'object',
	required: ['PUBLIC_PUSHER_APP_ID', 'PUBLIC_PORT'],
	properties: {
		PUBLIC_PUSHER_APP_ID: {
			type: 'string',
			default: ''
		},
		PUBLIC_PORT: {
			type: 'string',
			default: 6001
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

console.log(fastify.config);

// Declare a route
fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

fastify.get('/ping', async (request, reply) => {
	return { pong: 'it worked!' };
});

// CRUD
fastify.get('/users', async (request, reply) => {
	const users = await prisma.user.findMany();
	console.log('users', users);
	return { data: users };
});

/**
 * Run the server!
 */
const start = async () => {
	try {
		await fastify.listen({ port: fastify.config.PUBLIC_PORT });
	} catch (err) {
		fastify.log.error(err);
		await prisma.$disconnect();
		process.exit(1);
	}
};

start();
