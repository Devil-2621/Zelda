import { sentryMiddleware } from '@inngest/middleware-sentry';
import { Inngest } from 'inngest';

// Create a inngest client to send and receive events
export const inngest = new Inngest({
	id: 'zelda',
	middleware: [sentryMiddleware()],
});
