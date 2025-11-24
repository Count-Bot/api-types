export function getMaxInventory(premium: boolean): number {
  return premium ? 50 : 20;
}

export function getItemCooldown(premium: boolean): number {
  return premium ? 5000 : 20000;
}
