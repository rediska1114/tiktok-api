import Axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import retry from 'async-retry'
import { TiktokError } from '../../constants/errors'
import { TiktokChallengeResponse } from './types'
import { getChallengeParams } from './params'
import { RETRY_OPTIONS } from '../../constants/retry'
import { TIKTOK_URL, USER_AGENT } from '../../constants/urls'
import { signUrl } from '../../utils/signUrl'

export async function getChallenge(
	hashtag: string,
	proxy: string | undefined | null,
	region: string,
	msToken?: string
): Promise<{
	error?: string
	statusCode?: number
	data: TiktokChallengeResponse | null
}> {
	try {
		const data = await retry(async (bail) => {
			try {
				const params = getChallengeParams({
					hashtag,
					userAgent: USER_AGENT,
					msToken,
					region,
				})

				// Sign URL with X-Bogus and X-Gnarly
				const signedUrl = signUrl({
					url: `${TIKTOK_URL}/api/challenge/detail`,
					params,
					body: '',
					userAgent: USER_AGENT,
				})

				const { data } = await Axios.get<TiktokChallengeResponse>(signedUrl, {
					headers: {
						'user-agent': USER_AGENT,
					},
					httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
				})

				if (data.statusCode === TiktokError.HASHTAG_NOT_EXIST) {
					bail(new Error('HASHTAG_NOT_EXIST'))
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

		return { data }
	} catch (error: any) {
		if (error?.message === 'HASHTAG_NOT_EXIST') {
			return {
				error: 'HASHTAG_NOT_EXIST',
				statusCode: TiktokError.HASHTAG_NOT_EXIST,
				data: null,
			}
		}
		console.error('Error fetching challenge:', error)

		return {
			error: 'UNKNOWN_ERROR',
			statusCode: 0,
			data: null,
		}
	}
}
