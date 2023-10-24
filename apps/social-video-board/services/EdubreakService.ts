import { environment } from '../environments/environment'

const EdubreakService = {
	getEdubreakApiUrl() {
		const metaTag = document.head.querySelector('[itemprop~=edubreakAPIUrl][content]')
		if (metaTag) {
			// @ts-ignore
			if (metaTag['content']! !== null || metaTag['content'].length > 0) {
				// @ts-ignore
				return metaTag['content'] + '/api'
			}
		}
		if (environment.API_URL.length > 0) {
			return environment.API_URL + '/api'
		}
		// eslint-disable-next-line no-throw-literal
		throw 'Edubreak API URL not set'
	},

	getEdubreakAccessToken() {
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
		// eslint-disable-next-line no-throw-literal
		throw 'Edubreak Access Token not set'
	},

	createBoard: async function (title: any) {
		// Simple POST request with a JSON body using fetch
		const headers = {
			Authorization: 'Bearer ' + this.getEdubreakAccessToken(),
		}
		const options = {
			method: 'POST',
			headers: headers,
			body: title,
		}
		try {
			const data = await fetch(this.getEdubreakApiUrl() + '/svb', options).then((response) => {
				return response.json()
			})
			// eslint-disable-next-line no-console
			console.log('### EdubreakService: a new board was created ###', data)
			return data
		} catch (e) {
			console.error('### EdubreakService: error while creating a new board ###', e)
		}
	},

	getBoards: async function (): Promise<any> {
		// Simple GET request with a JSON body using fetch
		const headers = {
			Authorization: 'Bearer ' + this.getEdubreakAccessToken(),
		}
		const options = {
			method: 'GET',
			headers: headers,
		}
		try {
			const data = await fetch(this.getEdubreakApiUrl() + '/svb', options).then((response) => {
				return response.json()
			})
			// eslint-disable-next-line no-console
			console.log('### EdubreakService: current boards are ###', data)
			return data
		} catch (e) {
			console.warn('### EdubreakService: error while getting boards from server ###', e)
		}
	},

	getBoardIDfromURL: function () {
		const url = window.location.href
		const idRegex =
			/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/gm
		// @ts-ignore
		if (url.match(idRegex) !== null) {
			return url.match(idRegex)![0]
		} else {
			return null
		}
	},
}

export default EdubreakService
