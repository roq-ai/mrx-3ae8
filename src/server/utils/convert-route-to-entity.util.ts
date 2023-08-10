const mapping: Record<string, string> = {
  administrations: 'administration',
  reservations: 'reservation',
  usages: 'usage',
  users: 'user',
  vehicles: 'vehicle',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
