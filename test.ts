import { getUser, getUserPosts, getChallenge } from './dist/index.mjs'
async function posts() {
	// Test username - you can change this to any TikTok username
	const username = 'jzb19700dqs'

	console.log('=== Testing TikTok API Library ===\n')

	try {
		// Get user profile
		console.log(`Fetching user profile for @${username}...`)
		const userResult = await getUser(username)

		if (userResult.error) {
			console.error('Error getting user:', userResult.error)
			return
		}

		if (!userResult.data) {
			console.error('No user data returned')
			return
		}

		console.log('User Profile:')
		console.log('  Username:', userResult.data.userInfo.user.uniqueId)
		console.log('  Nickname:', userResult.data.userInfo.user.nickname)
		console.log('  Verified:', userResult.data.userInfo.user.verified)
		console.log('  Followers:', userResult.data.userInfo.stats.followerCount)
		console.log('  Following:', userResult.data.userInfo.stats.followingCount)
		console.log('  Total Hearts:', userResult.data.userInfo.stats.heartCount)
		console.log('  Total Videos:', userResult.data.userInfo.stats.videoCount)
		console.log('  SecUid:', userResult.data.userInfo.user.secUid)
		console.log('')


		// Get user posts
		console.log(`Fetching posts for @${username}...`)
		const postsResult = await getUserPosts(
			userResult.data.userInfo.user.secUid,
			undefined,
			undefined,
			userResult.msToken
		)

		if (postsResult.status === 'error') {
			console.error('Error getting posts:', postsResult.message)
			return
		}

		console.log(`Total posts fetched: ${postsResult.totalPosts}\n`)

		postsResult.result.forEach((post, index) => {
			console.log(`Post ${index + 1}:`)
			console.log('  ID:', post.id)
			console.log(
				'  Description:',
				post.desc.substring(0, 50) + (post.desc.length > 50 ? '...' : '')
			)
			console.log('  Views:', post.stats.playCount)
			console.log('  Likes:', post.stats.diggCount)
			console.log('  Comments:', post.stats.commentCount)
			console.log('  Shares:', post.stats.shareCount)
			console.log('  Created:', new Date(post.createTime * 1000).toLocaleDateString())

			if (post.video) {
				console.log('  Type: Video')
				console.log('  Duration:', post.video.duration + 's')
			} else if (post.imagePost) {
				console.log('  Type: Image Post')
				console.log('  Images:', post.imagePost.length)
			}
			console.log('')
		})

		console.log('=== Test completed successfully ===')
	} catch (error) {
		console.error('Test failed:', error.message)
		console.error(error)
	}
}

async function challenge() {
	// Test hashtag - you can change this to any TikTok hashtag
	const hashtag = 'fyp'

	console.log(`\nFetching challenge info for #${hashtag}...`)

	try {
		const challengeResult = await getChallenge(hashtag)

		if (challengeResult.error) {
			console.error('Error getting challenge:', challengeResult.error)
			return
		}

		console.log('Challenge Info:')
		console.log('  Hashtag:', challengeResult)
		console.log('\n=== Challenge test completed successfully ===')
	} catch (error) {
		console.error('Challenge test failed:', error.message)
		console.error(error)
	}
}


// challenge()
posts()