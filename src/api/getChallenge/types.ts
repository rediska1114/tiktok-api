export type TiktokChallengeResponse = {
  statusCode: number;

  challengeInfo?: {
    challenge: {
      id: `${number}`;
      isCommerce: boolean;
      stats: { videoCount: number; viewCount: number };
      title: string;
    };
    stats: { videoCount: number; viewCount: number };
    statsV2: { videoCount: `${number}`; viewCount: `${number}` };
  };
};
