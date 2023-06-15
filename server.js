import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import fastifyEnv from '@fastify/env';
import cors from '@fastify/cors';
import Pusher from 'pusher';

const fastify = Fastify({
	logger: true
});

const prisma = new PrismaClient();

// configure env
const envSchema = {
	type: 'object',
	required: ['PUSHER_APP_ID', 'PUSHER_APP_KEY', 'PUSHER_APP_SECRET', 'PUSHER_PORT', 'BACKEND_PORT'],
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

// console.log(fastify.config);

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
		await fastify.listen({ port: fastify.config.BACKEND_PORT });
	} catch (err) {
		fastify.log.error(err);
		await prisma.$disconnect();
		process.exit(1);
	}
};

start();
