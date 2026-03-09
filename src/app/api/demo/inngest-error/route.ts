import { inngest } from '@/inngest/client';

export async function POST() {
  // Simulating an error in Inngest function
  await inngest.send({ name: 'demo/inngest-error', data: {} });

  return Response.json({ status: 'started' });
}