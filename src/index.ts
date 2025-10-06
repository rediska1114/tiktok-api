export { getChallenge } from './api/getChallenge/index';
export { getUser } from './api/getUser/index';
export { getUserPosts } from './api/getUserPosts/index';

// Export types
export type {
  TiktokChallengeResponse,
} from './api/getChallenge/types';

export type {
  TiktokStalkUserResponse,
  UserProfile,
  StatsUserProfile,
  StatsV2UserProfile,
} from './api/getUser/types';

export type {
  TiktokUserPostsResponse,
  Posts,
  StatsPost,
  AuthorPost,
  VideoPost,
  MusicPost,
} from './api/getUserPosts/types';

export { TiktokError } from './constants/errors';
