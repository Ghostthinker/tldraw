import { environment } from './environment'

/**
 * @public
 */
export enum NodeTypeEnum {
	VIDEO = 'video',
	VIDEOCOMMENT = 'videocomment',
	BLOG = 'blog',
	DOCUMENT = 'cmap',
}

let domain = ''
let path = ''

/**
 *
 * @public
 */
export function getFlavor() {
	return environment.APP_FLAVOR
}
/**
 * Gets the edubreak endpoint for a certain node type.
 *
 * @public
 */
export async function getEdubreakEndpointFromType(options: any) {
	switch (options.type) {
		case NodeTypeEnum.VIDEO:
			return '/videos/'
		case NodeTypeEnum.VIDEOCOMMENT:
			return '/content/'
		case NodeTypeEnum.BLOG:
			return '/content/'
		case NodeTypeEnum.DOCUMENT:
			return '/content/'
		default:
			return ''
	}
}

/**
 * @public
 */
export function getEdubreakApiUrl() {
	const metaTag = document.head.querySelector('[itemprop~=edubreakAPIUrl][content]')
	if (metaTag) {
		// @ts-ignore
		if (metaTag['content']! !== null || metaTag['content'].length > 0) {
			// @ts-ignore
			return metaTag['content']
		}
	}
	if (environment.API_URL.length > 0) {
		return environment.API_URL
	}
	throw Object.assign(new Error('Edubreak API URL not set'))
}

/**
 * @public
 */
export function getEdubreakAccessToken() {
	const metaTag = document.head.querySelector('[itemprop~=accesstoken][content]')
	if (metaTag) {
		// @ts-ignore
		if (metaTag['content']! !== null || metaTag['content'].length > 0) {
			// @ts-ignore
			return metaTag['content']
		}
	}
	if (environment.ACCESS_TOKEN.length > 0) {
		return environment.ACCESS_TOKEN
	}
	throw Object.assign(new Error('Edubreak Access Token not set'))
}

/**
 * @public
 */
export async function getNodeAsJSON(options: any) {
	const endpoint = await getEdubreakEndpointFromType(options)
	const headers = { Authorization: 'Bearer ' + getEdubreakAccessToken() }
	return await fetch(getEdubreakApiUrl() + endpoint + options.id, { headers }).then((response) => {
		return response.json()
	})
}

/**
 * @public
 */
export function textIsEdubreakLink(text: string) {
	if (text.length < 1) {
		return false
	}
	try {
		// check if the pasted text is an edubreak link and set domain and path accordingly
		const options = parseEdubreakLink(text)
		if (options === null) {
			return false
		}
		domain = options.domain
		path = options.path

		return domain.includes('.edubreak.') && getNodeType(path) !== null
	} catch (e) {
		console.error(e)
		return false
	}
}

/**
 * @public
 */
export function getNodeType(path: string) {
	// checks if there is a node type in our pasted edubreak link
	const types = [
		NodeTypeEnum.VIDEO,
		NodeTypeEnum.VIDEOCOMMENT,
		NodeTypeEnum.BLOG,
		NodeTypeEnum.DOCUMENT,
	]

	for (const type of types) {
		const pathType = '/' + type + '/'
		if (path.includes(pathType)) {
			return type
		}
	}
	return null
}

/**
 * @public
 */
export function getEdubreakIds(edubreakPath: string) {
	// gets nid and og_id from pasted node edubreak link
	const regexp = /[\w.,@?^=%&:\/~+#-]*(course|group)-([0-9]*)[\w@?^=%&\/~+#-]*\/([0-9]+)/g
	const regMatches = edubreakPath.matchAll(regexp)
	const matches = []
	for (const regMatch of regMatches) {
		matches.push(regMatch)
	}
	return matches
}

/**
 * @public
 */
export function parseEdubreakLink(text: string) {
	const regexp =
		/(http|ftp|https)?:?\/?\/?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
	const regMatches = text.matchAll(regexp)
	const matches = []
	for (const regMatch of regMatches) {
		matches.push(regMatch)
	}
	if (matches.length < 1 || matches[0].length < 4) {
		return null
	}

	domain = matches[0][2]
	path = matches[0][3]

	const edubreakIds = getEdubreakIds(path)
	return {
		domain: domain,
		path: path,
		type: getNodeType(path),
		og_id: edubreakIds[0][2],
		nid: edubreakIds[0][3],
	}
}

/**
 * @public
 */
export async function saveStateToEdubreak(state: any) {
	// Simple PUT request with a JSON body using fetch
	const headers = {
		Authorization: 'Bearer ' + getEdubreakAccessToken(),
	}
	// get the board's ID from the url
	const boardId = getBoardIDfromURL()
	const options = {
		method: 'PUT',
		headers: headers,
		body: JSON.stringify(state),
	}
	try {
		await fetch(getEdubreakApiUrl() + '/svb/' + boardId, options)
		console.warn('### EdubreakService: current document state was saved ###')
	} catch (e) {
		console.error('### EdubreakService: error while persisting document state to the server ###', e)
	}
}

/**
 * @public
 */
export async function getStateFromEdubreak() {
	// Simple GET request with a JSON body using fetch
	const headers = {
		Authorization: 'Bearer ' + getEdubreakAccessToken(),
	}
	// get the board's ID from the url
	const boardId = getBoardIDfromURL()
	const options = {
		method: 'GET',
		headers: headers,
	}
	try {
		const data = await fetch(getEdubreakApiUrl() + '/svb/' + boardId, options).then((response) => {
			return response.json()
		})
		console.warn('### EdubreakService: current document state is ###', data)
		return data
	} catch (e) {
		console.warn('### EdubreakService: there is no server data for this board ###', e)
		return undefined
	}
}

/**
 * @public
 */
export function getBoardIDfromURL() {
	const url = window.location.href
	const idRegex =
		/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/gm
	// @ts-ignore
	return url.match(idRegex)[0]
}

/**
 * @public
 */
export async function getInbox() {
	// Simple GET request with a JSON body using fetch
	const headers = {
		Authorization: 'Bearer ' + getEdubreakAccessToken(),
	}
	// get the board's ID from the url
	const boardId = getBoardIDfromURL()
	const options = {
		method: 'GET',
		headers: headers,
	}
	try {
		const data = await fetch(getEdubreakApiUrl() + '/svb/' + boardId + '/inbox', options).then(
			(response) => {
				return response.json()
			}
		)
		console.warn('### EdubreakService: inbox is ###', data.data)
		return data.data
	} catch (e) {
		console.warn('### EdubreakService: there is no new inbox items for this board ###', e)
	}
}

/**
 * @public
 */
export async function addToInbox(artefact: any) {
	// Simple POST request with a JSON body using fetch
	try {
		const headers = {
			Authorization: 'Bearer ' + getEdubreakAccessToken(),
		}
		// get the board's ID from the url
		const boardId = getBoardIDfromURL()
		const options = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				artefact_id: String(artefact.props.id),
				artefact_type: 'content:' + artefact.props.type,
			}),
		}
		await fetch(getEdubreakApiUrl() + '/svb/' + boardId + '/inbox', options)
		console.warn('### EdubreakService: artefact was saved to inbox ###')
	} catch (e) {
		console.error('### EdubreakService: error while sending an artefact to the inbox ###', e)
	}
}

/**
 * @public
 */
export async function deleteFromInbox(nid: string) {
	// Simple DELETE request with a JSON body using fetch
	const headers = {
		Authorization: 'Bearer ' + getEdubreakAccessToken(),
	}
	// get the board's ID from the url
	const boardId = getBoardIDfromURL()
	const options = {
		method: 'DELETE',
		headers: headers,
	}
	try {
		const data = await fetch(
			getEdubreakApiUrl() + '/svb/' + boardId + '/inbox/' + nid,
			options
		).then((response) => {
			return response.json()
		})
		console.warn('### EdubreakService: Deleted artefact ' + nid + ' from server ###', data)
		return data
	} catch (e) {
		console.error('### EdubreakService: error deleting artefact ' + nid + ' from server ###', e)
	}
}
