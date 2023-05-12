const Version = 'develop'

export const getRequest = async (
	token: string,
	request,
	url: string
): Promise<any> => {
	const response = await request.get(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Version: Version,
		},
	})

	const json = await response.json()
	//const json = JSON.parse(await response.text());
	console.log('response', json)

	return json
}

export const getToken = async (
	request,
	baseUrl: string,
	payload: any
): Promise<string> => {
	const data = `grant_type=password&username=${payload.userName}&password=${payload.password}`
	const reqUrl = `${baseUrl}/token?clientID=seis&env=${payload.env}`
	const response = await request.post(reqUrl, {
		data,
		timeout: 0,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
	const json = JSON.parse(await response.text())

	return json.access_token
}

export const postRequest = async (
	token: string,
	request,
	url: string,
	payload: any
): Promise<any> => {
	console.log(url)
	const response = await request.post(url, {
		data: payload,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Version: Version,
		},
	})
	return JSON.parse(await response.text())
}
