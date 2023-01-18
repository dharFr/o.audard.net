/**
 * My own super simple algorithmically reversible, personal URL shortener.
 * Inpired by :
 *  - http://tantek.pbworks.com/w/page/21743973/Whistle 
 *  - https://indieweb.org/permashortlink
 *  - https://www.npmjs.com/package/whistler
 */


// Converts a shortened URL fragment (i.e. 'a202301082') into an expanded url-courte URL fragment (i.e. 'articles/2023/01/08/2').
// `categoryMapping` is provided as an optional parameter. If ommitted, the single letter from the fragment is used.
// Example value:
// {
// 	'a': 'articles',
// 	'n': 'notes',
// }
// Return an empty string if the fragment doesn't match the expected format
function expand(fragment, categoryMapping = {}) {

	const fragmentMatch = fragment.match(/([a-z])([0-9]{4})([0-9]{2})([0-9]{2})([0-9]+)/)
	if (fragmentMatch !== null) {
		const [, shortCategory, year, month, day, ordinal] = fragmentMatch

		return `${categoryMapping[shortCategory] || shortCategory}/${year}/${month}/${day}/${ordinal}`
	}
	return ''
}

// Converts a category, publication date (in JS Date object), and ordinal into a url-courte URL fragment.
function shorten(category, date, ordinal) {

	const year = date.getFullYear()
	const month = date.getMonth()+1 // getMonth() is 0-indexed
	const day = date.getDate()

	return `${category.substr(0,1)}${year}${month < 10 ? '0'+month : month}${day < 10 ? '0'+day : day}${ordinal}`
}

module.exports = {
	expand,
	shorten,
}