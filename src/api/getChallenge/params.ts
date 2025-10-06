import { generateDeviceId, generateOdinId } from '../../utils/helpers'
import { DEFAULT_MS_TOKEN } from '../../constants/tokens'

export const getChallengeParams = ({
	hashtag,
	userAgent,
	msToken,
	region,
}: {
	hashtag: string
	userAgent: string
	msToken?: string
	region?: string
}) => {
	return {
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
		challengeName: hashtag,
		cookie_enabled: true,
		data_collection_enabled: true,
		device_id: generateDeviceId(),
		device_platform: 'web_pc',
		focus_state: true,
		from_page: 'hashtag',
		history_len: 5,
		is_fullscreen: false,
		is_page_visible: true,
		language: 'en-GB',
		odinId: generateOdinId(),
		os: 'mac',
		priority_region: '',
		referer: '',
		region: region ?? 'GB',
		screen_height: 915,
		screen_width: 1052,
		tz_name: 'Europe/London',
		user_is_login: false,
		webcast_language: 'en-GB',
		msToken: msToken ?? DEFAULT_MS_TOKEN,
	}
}
