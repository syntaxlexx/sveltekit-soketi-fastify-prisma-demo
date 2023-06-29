// const corsConfig = require.resolve('s3rver/example/cors.xml');
// const websiteConfig = require.resolve('s3rver/example/website.xml');
// const S3rver = require.resolve('s3rver');

import S3rver from 's3rver';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

const BUCKET = 'images';

const instance = new S3rver({
	port: 4569,
	address: 'localhost',
	directory: './tmp/s3-test',
	silent: false,
	configureBuckets: [
		{
			name: BUCKET
			// configs: [fs.readFileSync(corsConfig), fs.readFileSync(websiteConfig)],
		}
	],
	accessKeyId: 'S3RVER',
	secretAccessKey: 'S3RVER'
}).run((err, { address, port } = {}) => {
	if (err) {
		console.error(err);
	} else {
		console.log('now listening at address %s and port %d', address, port);
	}
});

const s3Events = fromEvent(instance, 'event');
s3Events.subscribe((event) => console.log(event));
s3Events
	.pipe(filter((event) => event.Records[0].eventName == 'ObjectCreated:Copy'))
	.subscribe((event) => console.log(event));
