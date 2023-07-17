const mapping: Record<string, string> = {
  organizations: 'organization',
  platforms: 'platform',
  purchases: 'purchase',
  songs: 'song',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
