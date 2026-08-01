export const FULFILLMENT_STATUSES = [
  'new',
  'preparing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
] as const;

export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<FulfillmentStatus, readonly FulfillmentStatus[]> = {
  new: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  returned: [],
};

export function canTransitionFulfillmentStatus(
  current: string,
  next: FulfillmentStatus
): boolean {
  if (current === next) return true;
  if (!isFulfillmentStatus(current)) return false;
  return ALLOWED_TRANSITIONS[current].includes(next);
}

export function getSelectableFulfillmentStatuses(
  current: string
): FulfillmentStatus[] {
  if (!isFulfillmentStatus(current)) return [];
  return [current, ...ALLOWED_TRANSITIONS[current]];
}

function isFulfillmentStatus(value: string): value is FulfillmentStatus {
  return FULFILLMENT_STATUSES.includes(value as FulfillmentStatus);
}
