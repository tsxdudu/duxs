
export const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return count.toString();
};
