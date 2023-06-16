# Soketi-Fastify Chat App
A sample and kinda-unique Chat App build after peer-pressure from [Twitter](https://twitter.com/syntaxlexx) that (allegedly): 
- `Fastify` is faster than `Express`
- `Soketi` is also faster than `Pusher`, `Socket.io`
- `Redis` is...well, Redis!
- `Sveltekit` performs arguably better than `React`,`Next`,`Nuxt`,`Jquery` (huh?!) with better syntax
- `Twitter` is better than `Masterdon`

And oh-boy! Do I have a 2016 Pc that barely notices the first 3 claims! 
> You're sure your new M1 MBP will notice it? 
As for React ....... they ain't lying!

## Quick Docs
### Node Server
Start the server by running:

```bash
node server
```

### Prisma
Create migration

```bash
npx prisma migrate dev --name init

npx prisma studio 
npx prisma studio --browser none
```

### Soketi
Install using Docker. Honestly, why would you not use docker?!
```bash
docker run -p 6001:6001 -p 9601:9601 quay.io/soketi/soketi:1.4-16-debian
```


## In-Thought & Architecture
- **Sveltekit** handles the authentication/authorization in the SPA/SSR-side-of-life. 
- **Fastify(Node**) handles the API-side, that is the websockets/pusher side-of-life. To prevent multiple/redundant authentications, we pass the `cookie` from Sveltekit as an `access_token` header when sending messages to the **node backend**. 
- Arguably, the entire `SSR` can be made an `SPA` by just issuing `JWT tokens / access_tokens` from the **node backend**. I just prefer keeping the **node backend** light on its duties, and let **Sveltekit** do what its best at: *everything else!*.


## After-thoughts
The nature of `Pub/Sub` is really not feasible for medium-to-large scale apps as compared to `Bidirectional Streaming`. The authentication mechanism is not really feasible. 
That is why **Soketi** is mostly advertised and/or used with Laravel, since it is ... PHP.

For true live-chats, it would be better sticking to **bidirectional** Websockets, [As explained here](), [and here](https://stackoverflow.com/questions/53689633/can-google-pub-sub-be-used-for-chat-messaging), [and this too.](https://stackoverflow.com/questions/71746954/pub-sub-vs-bidirectional-streaming-in-grpc-for-chat-service)

## The Normal, Boring Docs
> Boring is good
Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

