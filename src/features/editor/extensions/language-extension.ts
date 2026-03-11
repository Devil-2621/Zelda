import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { Extension } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

export const getLanguageExtension = (filename: string): Extension => {
	const ext = filename.split('.').pop()?.toLowerCase();

	switch (ext) {
		case 'js':
			return javascript();
		case 'jsx':
			return javascript({ jsx: true });
		case 'ts':
			return javascript({ typescript: true });
		case 'tsx':
			return javascript({ typescript: true, jsx: true });
		case 'html':
			return html();
		case 'css':
			return css();
		case 'json':
			return json();
		case 'md':
		case 'mdx':
			return markdown();
		case 'py':
			return python();
		default:
			return [];
	}
};
