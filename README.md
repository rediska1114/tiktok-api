# @rediska1114/tiktok-api

TikTok API library for fetching user profiles, posts, and challenges using official TikTok API endpoints with URL signing (X-Bogus and X-Gnarly).

## Installation

```bash
npm install @rediska1114/tiktok-api
```

## Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install axios async-retry https-proxy-agent
```

## Usage

### ES Modules

```typescript
import { getUser, getUserPosts, getChallenge } from '@rediska1114/tiktok-api';

// Get user profile
const userResult = await getUser('username');
if (userResult.error) {
  console.error('Error:', userResult.error);
} else {
  console.log('User:', userResult.data.userInfo.user);
  console.log('Stats:', userResult.data.userInfo.stats);
  console.log('msToken:', userResult.msToken);
}

// Get user posts (with msToken from getUser response)
const postsResult = await getUserPosts(
  userResult.data.userInfo.user.secUid,
  undefined,
  10,
  userResult.msToken
);
if (postsResult.error) {
  console.error('Error:', postsResult.error);
} else {
  console.log('Posts:', postsResult.data);
}

// Get challenge/hashtag info
const challengeResult = await getChallenge('fyp');
if (challengeResult.error) {
  console.error('Error:', challengeResult.error);
} else {
  console.log('Challenge:', challengeResult.data);
}
```

### CommonJS

```javascript
const { getUser, getUserPosts, getChallenge } = require('@rediska1114/tiktok-api');

// Get user profile
getUser('username').then(userResult => {
  if (userResult.error) {
    console.error('Error:', userResult.error);
  } else {
    console.log('User:', userResult.data.userInfo.user);
  }
});
```

## API

### `getUser(username: string, proxy?: string, msToken?: string, region?: string)`

Fetches user profile information from TikTok API.

**Parameters:**
- `username` - TikTok username (with or without @)
- `proxy` (optional) - HTTP proxy URL
- `msToken` (optional) - TikTok msToken for request authentication
- `region` (optional) - Region code (default: 'GB')

**Returns:** `Promise<TiktokStalkUserResponse>`

```typescript
{
  error?: string;
  statusCode?: number;
  data: TiktokUserDetailResponse | null;
  msToken?: string;
}
```

### `getUserPosts(secUid: string, proxy?: string, postLimit?: number, msToken?: string)`

Fetches user posts with automatic msToken rotation.

**Parameters:**
- `secUid` - User's secure ID (obtained from `getUser`)
- `proxy` (optional) - HTTP proxy URL
- `postLimit` (optional) - Maximum number of posts to fetch
- `msToken` (optional) - TikTok msToken for request authentication (rotates automatically)

**Returns:** `Promise<TiktokUserPostsResponse>`

```typescript
{
  error?: string;
  statusCode?: number;
  data: Posts[] | null;
  totalPosts: number;
}
```

### `getChallenge(hashtag: string, proxy?: string, msToken?: string, region?: string)`

Fetches challenge/hashtag information from TikTok API.

**Parameters:**
- `hashtag` - Hashtag/challenge name
- `proxy` (optional) - HTTP proxy URL
- `msToken` (optional) - TikTok msToken for request authentication
- `region` (optional) - Region code (default: 'GB')

**Returns:** `Promise<{ error?: string; statusCode?: number; data: TiktokChallengeResponse | null }>`

## Features

- ✅ Official TikTok API endpoints
- ✅ URL signing with X-Bogus (RC4) and X-Gnarly (ChaCha20)
- ✅ Automatic msToken extraction and rotation
- ✅ Retry logic with exponential backoff
- ✅ Proxy support
- ✅ Full TypeScript support
- ✅ Dual module format (ESM + CommonJS)
- ✅ Preserves directory structure for better tree-shaking

## Types

All TypeScript types are exported from the main module:

```typescript
import type {
  TiktokStalkUserResponse,
  TiktokUserDetailResponse,
  UserProfile,
  StatsUserProfile,
  StatsV2UserProfile,
  TiktokUserPostsResponse,
  Posts,
  TiktokChallengeResponse,
  TiktokError
} from '@rediska1114/tiktok-api';
```

## Error Handling

The library uses error codes from TikTok API:

```typescript
enum TiktokError {
  HASHTAG_NOT_EXIST = 10205,
  HASHTAG_BLACK_LIST = 10209,
  HASHTAG_SENSITIVITY_WORD = 10211,
  HASHTAG_UNSHELVE = 10212,
  USER_BAN = 10221,
  USER_PRIVATE = 10222,
  USER_NOT_EXIST = 10202,
  INVALID_ENTITY = 10201,
}
```

## References

This library uses URL signing techniques based on research from:
- [tiktok-web-reverse-engineering](https://github.com/justbeluga/tiktok-web-reverse-engineering) - X-Bogus and X-Gnarly signature implementation

## License

ISC
