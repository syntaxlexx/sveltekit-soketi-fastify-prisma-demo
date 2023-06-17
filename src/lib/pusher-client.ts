import { PUBLIC_PUSHER_APP_KEY, PUBLIC_PUSHER_PORT } from '$env/static/public';
import PusherJs from 'pusher-js';
import type Pusher from 'pusher-js/types/src/core/pusher';
import { backendUrl } from './constants';

const initializePusher = (headers = {}) => {

    return new PusherJs(PUBLIC_PUSHER_APP_KEY, {
        wsHost: '127.0.0.1',
        cluster: 'local',
        wsPort: Number(PUBLIC_PUSHER_PORT),
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        channelAuthorization: {
            endpoint: `${backendUrl}/pusher/auth`,
            headers,
        }
    });
}

export {
    initializePusher,
    Pusher
}
