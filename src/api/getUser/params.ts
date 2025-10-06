import { generateDeviceId, generateOdinId } from '../../utils/helpers'
import { DEFAULT_MS_TOKEN } from '../../constants/tokens'

export const getUserParams = ({
	username,
	userAgent,
	msToken,
	region,
}: {
	username: string
	userAgent: string
	msToken?: string
	region?: string
}) => {
	return {
		WebIdLastTime: Date.now(),
		abTestVersion: '',
		aid: 1988,
		appType: 'm',
		app_language: 'en-GB',
		app_name: 'tiktok_web',
		browser_language: 'en-GB',
		browser_name: 'Mozilla',
		browser_online: true,
		browser_platform: 'MacIntel',
		browser_version: userAgent,
		channel: 'tiktok_web',
		cookie_enabled: true,
		data_collection_enabled: true,
		device_id: generateDeviceId(),
		device_platform: 'web_pc',
		focus_state: true,
		from_page: 'user',
		history_len: 6,
		is_fullscreen: false,
		is_page_visible: true,
		language: 'en-GB',
		needAudienceControl: true,
		odinId: generateOdinId(),
		os: 'mac',
		priority_region: '',
		referer: '',
		region: region ?? 'GB',
		screen_height: 915,
		screen_width: 1052,
		secUid: '',
		tz_name: 'Europe/London',
		uniqueId: username,
		user_is_login: false,
		webcast_language: 'en-GB',
		msToken: msToken ?? DEFAULT_MS_TOKEN,
	}
}
