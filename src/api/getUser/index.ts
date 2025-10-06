import Axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import retry from 'async-retry'
import { TiktokError } from '../../constants/errors'
import { TiktokStalkUserResponse } from './types'
import { getUserParams } from './params'
import { RETRY_OPTIONS } from '../../constants/retry'
import { TIKTOK_URL, USER_AGENT } from '../../constants/urls'
import { signUrl } from '../../utils/signUrl'
import { extractMsToken } from '../../utils/helpers'

export async function getUser(
	username: string,
	proxy?: string,
	msToken?: string,
	region?: string
): Promise<TiktokStalkUserResponse> {
	try {
		username = username.replace('@', '')

		let extractedMsToken: string | undefined = undefined

		const data = await retry(async (bail) => {
			try {
				const params = getUserParams({
					username,
					userAgent: USER_AGENT,
					msToken,
					region,
				})

				// Sign URL with X-Bogus and X-Gnarly
				const signedUrl = signUrl({
					url: `${TIKTOK_URL}/api/user/detail`,
					params,
					body: '',
					userAgent: USER_AGENT,
				})

				const { data, headers } = await Axios.get(signedUrl, {
					headers: {
						'user-agent': USER_AGENT,
					},
					httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
				})

				// Extract msToken from response cookies
				const newMsToken = extractMsToken(headers['set-cookie'])
				if (newMsToken) {
					extractedMsToken = newMsToken
				}

				if (
					data.statusCode === TiktokError.USER_NOT_EXIST ||
					data.statusCode === TiktokError.USER_BAN ||
					data.statusCode === TiktokError.USER_PRIVATE
				) {
					bail(new Error('USER_NOT_EXIST'))
					return null
				}

				return data
			} catch (error: any) {
				if (
					error.response?.status === 400 ||
					error.response?.data?.statusCode === TiktokError.INVALID_ENTITY
				) {
					bail(new Error('INVALID_ENTITY'))
					return null
				}
				throw error
			}
		}, RETRY_OPTIONS)

		return { data, msToken: extractedMsToken }
	} catch (error: any) {
		if (error?.message === 'USER_NOT_EXIST') {
			return {
				error: 'USER_NOT_EXIST',
				statusCode: TiktokError.USER_NOT_EXIST,
				data: null,
			}
		}
		console.error('Error fetching user:', error)

		return {
			error: 'UNKNOWN_ERROR',
			statusCode: 0,
			data: null,
		}
	}
}
