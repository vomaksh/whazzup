export function debounce(fn: (...args: any[]) => void, milliseconds: number) {
  let timerId: NodeJS.Timeout;

  return function (...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => fn.apply(this, args), milliseconds);
  };
}

export function getUnreadCountFromFavicon(faviconUrl: string) {
  const match = faviconUrl.match(
    /https:\/\/web\.whatsapp\.com\/favicon\/2x\/f(\d+)\//,
  );
  return match ? parseInt(match[1], 10) : 0;
}
