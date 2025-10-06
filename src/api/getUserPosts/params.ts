import qs from 'qs'
import { generateDeviceId, generateOdinId } from '../../utils/helpers'
import { DEFAULT_MS_TOKEN } from '../../constants/tokens'

export const getUserPostsParams = ({
	userAgent,
	count,
	cursor,
	secUid,
	msToken,
	region,
}: {
	userAgent: string
	count: number
	cursor: number
	secUid: string
	msToken?: string
	region: string
}) => {
	return {
		count,
		cursor,
		secUid,

		//

		WebIdLastTime: Date.now(),
		aid: 1988,
		app_language: 'en-GB',
		app_name: 'tiktok_web',
		browser_language: 'en-GB',
		browser_name: 'Mozilla',
		browser_online: true,
		browser_platform: 'MacIntel',
		browser_version: userAgent,
		channel: 'tiktok_web',
		cookie_enabled: true,
		clientABVersions: '',
		coverFormat: 0,
		data_collection_enabled: true,
		device_id: generateDeviceId(),
		device_platform: 'web_pc',
		focus_state: true,
		enable_cache: false,
		from_page: 'user',
		history_len: 2,
		is_fullscreen: false,
		is_page_visible: true,
		needPinnedItemIds: true,
		language: 'en-GB',
		odinId: generateOdinId(),
		os: 'mac',
		priority_region: '',
		post_item_list_request_type: 0,
		referer: '',
		region: region ?? 'GB',
		screen_height: 943,
		screen_width: 1052,

		tz_name: 'Pacific/Auckland',
		user_is_login: false,
		video_encoding: 'mp4',
		webcast_language: 'en-GB',
		msToken: msToken ?? DEFAULT_MS_TOKEN,
	}
}

export const xttParams = (secUid: string, cursor: number, count: number) => {
	return qs.stringify({
		aid: '1988',
		cookie_enabled: true,
		screen_width: 0,
		screen_height: 0,
		browser_language: '',
		browser_platform: '',
		browser_name: '',
		browser_version: '',
		browser_online: '',
		timezone_name: 'Europe/London',
		secUid,
		cursor,
		count,
		is_encryption: 1,
	})
}
