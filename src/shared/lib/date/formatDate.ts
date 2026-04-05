const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

export function formatDate(dateString: string) {
  return dateFormatter.format(new Date(dateString));
}
