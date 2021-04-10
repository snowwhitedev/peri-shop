export function getTimesOfDate (date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  return formatter.format(date);
}
