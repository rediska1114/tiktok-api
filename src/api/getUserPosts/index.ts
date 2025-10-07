import Axios from 'axios'
import { AuthorPost, Posts, TiktokUserPostsResponse } from './types'
import { getUserPostsParams } from './params'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { signUrl } from '../../utils/signUrl'
import retry from 'async-retry'
import { TiktokError } from '../../constants/errors'
import { RETRY_OPTIONS } from '../../constants/retry'
import { TIKTOK_URL, USER_AGENT } from '../../constants/urls'
import { extractMsToken } from '../../utils/helpers'

const DEFAULT_POST_COUNT = 16

export const getUserPosts = (
	secUid: string,
	proxy: string | undefined | null,
	postLimit: number | undefined,
	region: string,
	msToken?: string
): Promise<TiktokUserPostsResponse> =>
	new Promise(async (resolve) => {
		try {
			const data = await parseUserPosts(secUid, postLimit, region, proxy, msToken)

			if (!data.length)
				return resolve({
					error: 'USER_NOT_FOUND',
					statusCode: TiktokError.USER_NOT_EXIST,
					data: null,
					totalPosts: 0,
				})

			resolve({
				data,
				totalPosts: data.length,
			})
		} catch (err: any) {
			console.error('Error fetching user posts:', err)
			if (
				err.status == 400 ||
				(err.response?.data && err.response.data.statusCode == TiktokError.INVALID_ENTITY)
			) {
				return resolve({
					error: 'VIDEO_NOT_FOUND',
					statusCode: TiktokError.INVALID_ENTITY,
					data: null,
					totalPosts: 0,
				})
			} else if (err.message === 'EMPTY_RESPONSE') {
				return resolve({
					error: 'EMPTY_RESPONSE',
					statusCode: 0,
					data: null,
					totalPosts: 0,
				})
			} else {
				return resolve({
					error: 'UNKNOWN_ERROR',
					statusCode: 0,
					data: null,
					totalPosts: 0,
				})
			}
		}
	})

const parseUserPosts = async (
	secUid: string,
	postLimit: number | undefined,
	region: string,
	proxy?: string | null,
	msToken?: string
): Promise<Posts[]> => {
	// Posts Result
	let page = 1
	let hasMore = true
	let responseCursor = 0
	const posts: Posts[] = []
	let counter = 0
	let currentMsToken: string | undefined = msToken

	while (hasMore) {
		let result: any | null = null

		// Prevent missing response posts
		result = await retry(async (bail) => {
			try {
				const params = getUserPostsParams({
					userAgent: USER_AGENT,
					count: DEFAULT_POST_COUNT,
					cursor: responseCursor,
					secUid,
					// msToken: currentMsToken, // for some reason this doesn't work now
					region,
				})

				// Sign URL with X-Bogus and X-Gnarly
				const signedUrl = signUrl({
					url: `${TIKTOK_URL}/api/post/item_list`,
					params: params,
					userAgent: USER_AGENT,
				})

				const { data, headers } = await Axios.get(signedUrl, {
					headers: { 'user-agent': USER_AGENT },
					httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
				})

				// Extract msToken from response cookies for rotation
				const newMsToken = headers['x-ms-token'] // extractMsToken(headers['set-cookie'])
				if (newMsToken) {
					currentMsToken = newMsToken
				}

				if (data === '') {
					throw new Error('EMPTY_RESPONSE')
				}

				return data
			} catch (error: any) {
				if (
					error.response?.status === 400 ||
					error.response?.data?.statusCode === TiktokError.INVALID_ENTITY
				) {
					bail(new Error('Video not found!'))
					return
				}
				throw error
			}
		}, RETRY_OPTIONS)

		result?.itemList?.forEach((v: any) => {
			// Skip if we already have this video ID in posts
			if (posts.some((post) => post.id === v.id)) {
				return
			}

			const author: AuthorPost = {
				id: v.author.id,
				username: v.author.uniqueId,
				nickname: v.author.nickname,
				avatarLarger: v.author.avatarLarger,
				avatarThumb: v.author.avatarThumb,
				avatarMedium: v.author.avatarMedium,
				signature: v.author.signature,
				verified: v.author.verified,
				openFavorite: v.author.openFavorite,
				privateAccount: v.author.privateAccount,
				isADVirtual: v.author.isADVirtual,
				isEmbedBanned: v.author.isEmbedBanned,
			}

			if (v.imagePost) {
				const imagePost: string[] = v.imagePost.images.map((img: any) => img.imageURL.urlList[0])

				posts.push({
					id: v.id,
					desc: v.desc,
					createTime: v.createTime,
					digged: v.digged,
					duetEnabled: v.duetEnabled,
					forFriend: v.forFriend,
					officalItem: v.officalItem,
					originalItem: v.originalItem,
					privateItem: v.privateItem,
					shareEnabled: v.shareEnabled,
					stitchEnabled: v.stitchEnabled,
					stats: v.stats,
					music: v.music,
					author,
					imagePost,
					isPinnedItem: v.isPinnedItem,
				})
			} else {
				const video = {
					id: v.video.id,
					duration: v.video.duration,
					format: v.video.format,
					bitrate: v.video.bitrate,
					ratio: v.video.ratio,
					playAddr: v.video.playAddr,
					cover: v.video.cover,
					originCover: v.video.originCover,
					dynamicCover: v.video.dynamicCover,
					downloadAddr: v.video.downloadAddr,
				}

				posts.push({
					id: v.id,
					desc: v.desc,
					createTime: v.createTime,
					digged: v.digged,
					duetEnabled: v.duetEnabled,
					forFriend: v.forFriend,
					officalItem: v.officalItem,
					originalItem: v.originalItem,
					privateItem: v.privateItem,
					shareEnabled: v.shareEnabled,
					stitchEnabled: v.stitchEnabled,
					stats: v.stats,
					music: v.music,
					isPinnedItem: v.isPinnedItem,
					author,
					video,
				})
			}
		})

		hasMore = result.hasMore
		responseCursor = hasMore ? result.cursor : 0
		page++
		counter++

		// Check post limit if specified
		if (postLimit && posts.length >= postLimit) {
			hasMore = false
			break
		}
	}

	return postLimit ? posts.slice(0, postLimit) : posts
}
