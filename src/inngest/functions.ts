import { firecrawl } from '@/lib/firecrawl';
import { google } from '@ai-sdk/google';
import { inngest } from './client';
import { generateText } from 'ai';

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
	{ id: 'demo-generate' },
	{ event: 'demo/generate' },
	async ({ event, step }) => {
		const { prompt } = event.data as { prompt: string };

		const urls = (await step.run('extract-urls', async () => {
			return prompt.match(URL_REGEX) || [];
		})) as string[];

		const scrapedContent = await step.run('scrape-urls', async () => {
			const results = await Promise.all(
				urls.map(async (url) => {
					const result = await firecrawl.scrape(url, { formats: ['markdown'] });
					return result.markdown ?? null;
				}),
			);
			return results.filter(Boolean).join('\n\n');
		});

		const finalPrompt = scrapedContent
			? `Context:\n${scrapedContent}\n\nQuestion:\n${prompt}`
			: prompt;

		await step.run('generate-text', async () => {
			// Simulate a long-running task
			return await generateText({
				model: google('gemini-2.5-flash'),
				prompt: finalPrompt,
				experimental_telemetry: {
					isEnabled: true,
					recordInputs: true,
					recordOutputs: true,
				},
			});
		});
	},
);

export const demoInngestError = inngest.createFunction(
	{ id: 'demo-inngest-error' },
	{ event: 'demo/inngest-error' },
	async ({ step }) => {
		// Simulate an error in the Inngest function
		await step.run('inngest-error', async () => {
			throw new Error('Inngest error: Background job failed!');
		});
	},
);