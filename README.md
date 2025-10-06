# @rediska1114/tiktok-api

TikTok API library for fetching user profiles, posts, and challenges.

## Installation

```bash
npm install @rediska1114/tiktok-api
```

## Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install axios cheerio qs async-retry https-proxy-agent
```

## Usage

### ES Modules

```typescript
import { getUser, getUserPosts, getChallenge } from '@rediska1114/tiktok-api';

// Get user profile
const user = await getUser('username');
console.log(user);

// Get user posts
const posts = await getUserPosts('user_sec_uid', undefined, 10);
console.log(posts);

// Get challenge/hashtag info
const challenge = await getChallenge('fyp');
console.log(challenge);
```

### CommonJS

```javascript
const { getUser, getUserPosts, getChallenge } = require('@rediska1114/tiktok-api');

// Get user profile
getUser('username').then(user => {
  console.log(user);
});
```

## API

### `getUser(username: string, proxy?: string)`

Fetches user profile information.

**Parameters:**
- `username` - TikTok username (with or without @)
- `proxy` (optional) - HTTP proxy URL

**Returns:** `Promise<TiktokStalkUserResponse>`

### `getUserPosts(secUid: string, proxy?: string, postLimit?: number)`

Fetches user posts.

**Parameters:**
- `secUid` - User's secure ID (obtained from `getUser`)
- `proxy` (optional) - HTTP proxy URL
- `postLimit` (optional) - Maximum number of posts to fetch

**Returns:** `Promise<TiktokUserPostsResponse>`

### `getChallenge(hashtag: string, proxy?: string)`

Fetches challenge/hashtag information.

**Parameters:**
- `hashtag` - Hashtag/challenge name
- `proxy` (optional) - HTTP proxy URL

**Returns:** `Promise<{ error?: string; statusCode?: number; data: TiktokChallengeResponse | null }>`

## Types

All TypeScript types are exported from the main module:

```typescript
import type {
  TiktokStalkUserResponse,
  UserProfile,
  TiktokUserPostsResponse,
  Posts,
  TiktokChallengeResponse,
  TiktokError
} from '@rediska1114/tiktok-api';
```

## License

ISC
