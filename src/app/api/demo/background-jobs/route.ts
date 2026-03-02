// this route serves on POST localhost:3000/api/demo/background-jobs
import { NextResponse } from 'next/server';

import { inngest } from '@/inngest/client';

// openrouter imports for using openrouter provider in background jobs demo
// import { createOpenRouter } from '@openrouter/ai-sdk-provider';
// import { streamText } from 'ai';

// Create an OpenRouter client
// const openrouter = createOpenRouter({
// 	apiKey: process.env.OPENROUTER_AI_API_KEY!,
/**
 * Triggers the 'demo/generate' background job and returns a short JSON status.
 *
 * Enqueues a background task named "demo/generate" with an empty payload via the configured Inngest client.
 *
 * @returns A JSON response with `{ status: 'started' }`
 */

export async function POST() {
	await inngest.send({
		name: 'demo/generate',
		data: {},
	});

	// Example of using openrouter provider with stream-text in background jobs demo (without blocking API response) - you can replace it with any long-running task or any other provider of your choice
	// const response = await streamText({
	// 	// model: openrouter.chat('arcee-ai/trinity-mini:free'),
	// 	model: openrouter.chat('openai/gpt-oss-120b:free'),
	// 	prompt: 'create a todo list app in tanstack start.',
	// });

	// this loop is just to show how you can consume streaming response in background job, you can remove it in your actual implementation
  // for await (const chunk of response.textStream) {
  //   console.log(chunk);
  // }
	return NextResponse.json({ status: 'started' });
}
