// this router serves on POST localhost:3000/api/demo/blocking
import { NextResponse } from 'next/server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// openrouter imports for using openrouter provider in background jobs demo
// import { createOpenRouter } from '@openrouter/ai-sdk-provider';
// import { streamText } from 'ai';

// Create an OpenRouter client
// const openrouter = createOpenRouter({
// 	apiKey: process.env.OPENROUTER_AI_API_KEY!,
/**
 * Handle POST requests by generating a haiku about the ocean and returning it as JSON.
 *
 * @returns A NextResponse with a JSON body containing a `text` property set to the generated haiku.
 */

export async function POST() {
	const response = await generateText({
		model: google('gemini-2.5-flash'),
		prompt: 'Write a haiku about the ocean.',
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
	return NextResponse.json({ text: response });
}
