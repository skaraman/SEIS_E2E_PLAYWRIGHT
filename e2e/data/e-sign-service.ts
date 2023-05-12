import { api } from '../helpers'

export const getSignatureUrl = async (
	token: string,
	baseApiUrl: string,
	request,
	studentId: number
): Promise<string> => {
	return await api.getRequest(
		token,
		request,
		`${baseApiUrl}/api/digitalsignature/student/${studentId}/signatureurls`
	)
}
