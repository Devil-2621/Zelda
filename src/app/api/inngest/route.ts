import { inngest } from '@/inngest/client';
import { demoGenerate } from '@/inngest/functions';
import { serve } from 'inngest/next';

// Create an API that serves functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		demoGenerate
	],
});
