export type TiktokStalkUserResponse = {
	error?: string
	statusCode?: number
	data: TiktokUserDetailResponse | null
	msToken?: string
}

export type TiktokUserDetailResponse = {
	extra: {
		fatal_item_ids: any[]
		logid: string
		now: number
	}
	log_pb: {
		impr_id: string
	}
	shareMeta: {
		desc: string
		title: string
	}
	statusCode: number
	status_code: number
	status_msg: string
	userInfo: {
		stats: StatsUserProfile
		statsV2: StatsV2UserProfile
		user: UserProfile
	}
}

export type UserProfile = {
	UserStoryStatus: number
	avatarLarger: string
	avatarMedium: string
	avatarThumb: string
	bioLink?: {
		link: string
		risk: number
	}
	canExpPlaylist: boolean
	commentSetting: number
	commerceUserInfo: {
		commerceUser: boolean
	}
	downloadSetting: number
	duetSetting: number
	followingVisibility: number
	ftc: boolean
	id: string
	isADVirtual: boolean
	isEmbedBanned: boolean
	nickNameModifyTime: number
	nickname: string
	openFavorite: boolean
	privateAccount: boolean
	profileEmbedPermission: number
	profileTab: {
		showPlayListTab: boolean
		showQuestionTab: boolean
	}
	relation: number
	secUid: string
	secret: boolean
	signature: string
	stitchSetting: number
	ttSeller: boolean
	uniqueId: string
	verified: boolean
}

export type StatsUserProfile = {
	diggCount: number
	followerCount: number
	followingCount: number
	friendCount: number
	heart: number
	heartCount: number
	videoCount: number
}

export type StatsV2UserProfile = {
	diggCount: string
	followerCount: string
	followingCount: string
	friendCount: string
	heart: string
	heartCount: string
	videoCount: string
}
