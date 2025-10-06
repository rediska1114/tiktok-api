export const randomChar = (char: string, range: number) => {
  let chars = '';
  for (let i = 0; i < range; i++) {
    chars += char[Math.floor(Math.random() * char.length)];
  }
  return chars;
};

export const generateDeviceId = () => {
  const prefix = '7';
  const random = randomChar('0123456789', 18);
  return `${prefix}${random}`;
};

export const generateOdinId = () => {
  const prefix = '7';
  const random = randomChar('0123456789', 18);
  return `${prefix}${random}`;
};

export const extractMsToken = (cookies?: string[]): string | undefined => {
  if (!cookies || !Array.isArray(cookies)) {
    return undefined;
  }

  const msTokenCookie = cookies.find((cookie) => cookie.startsWith('msToken='));
  if (!msTokenCookie) {
    return undefined;
  }

  const match = msTokenCookie.match(/msToken=([^;]+)/);
  return match ? match[1] : undefined;
};
