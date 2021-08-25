export function removeFromArray<T>(array: T[], find: T) {
  const index = array.indexOf(find);
  if (index > -1) {
    array.splice(index, 1);
  }
}
