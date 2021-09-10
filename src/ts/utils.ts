export function removeFromArray<T>(array: T[], find: T) {
  const index = array.indexOf(find);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function getLevel() {
  return window.localStorage.getItem('planethoppers-level') || 0;
}

export function setLevel(level: number) {
  window.localStorage.setItem('planethoppers-level', level);
}
