import { demoGenerate, demoInngestError } from '@/inngest/functions';
import { inngest } from '@/inngest/client';
import { serve } from 'inngest/next';

// Create an API that serves functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [demoGenerate, demoInngestError],
});
