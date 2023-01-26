import got from 'got'
import { expand } from '@dhar/url-courte'

export async function handler(event, context) {
	// expanding: https://o.audard.net/a202301081

	let redirectUrl = new URL('https://olivier.audard.net')
	const path = event.path.replace(/\/\.netlify\/functions\/[^/]+/, '')
	const expandedFragment = expand(path, {
		'a': 'articles',
		'n': 'notes',
	})
	console.log('expanded', path, 'to', expandedFragment)

	if (expandedFragment !== '') {
		const [, expandedPathname, ordinal] = expandedFragment.match(/^(.*)\/([0-9]+)$/)
		redirectUrl.pathname = expandedPathname

		try {
			const feed = await got('https://olivier.audard.net/feed.json').json();
			
			const item = feed.items.filter((item) => 
				item.url.startsWith(redirectUrl.href)
			)[ordinal-1]

			if (item === undefined) {
				throw `Could not find ${ordinal}th items on ${redirectUrl.pathname}`
			}
			redirectUrl = new URL(item.url)
		} catch (err) {
			console.error(`Failed to expand ${path}`)
			if (err.response) {
				console.error('>>>', err.response.statusCode, err.response.requestUrl.href)
			}
			else {
				console.error('>>>', err)
			}
			redirectUrl.pathname = ''
		}
	}

	redirectUrl.searchParams.append('utm_campaign', 'short')
	return {
		statusCode: 302,
		headers: {
			Location: redirectUrl,
			'Cache-Control': 'no-cache',
	  	},
		body: JSON.stringify({})
	}
}