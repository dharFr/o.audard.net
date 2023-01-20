const Parser = require('rss-parser');
const { expand } = require('@dhar/url-courte')

exports.handler = async function (event, context) {
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

		const parser = new Parser();
		const feed = await parser.parseURL('https://olivier.audard.net/atom.xml');

		const item = feed.items.filter((item) => {
			return item.link.startsWith(redirectUrl.href)
		})[ordinal-1]
		redirectUrl = new URL(item.link)
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