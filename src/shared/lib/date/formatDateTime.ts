const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

export function formatDateTime(dateString: string) {
  return dateTimeFormatter.format(new Date(dateString));
}
