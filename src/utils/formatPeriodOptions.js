export function formatPeriodOptions(data) {
  return data
    .filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value),
    )
    .sort((a, b) => new Date(b.value) - new Date(a.value));
}
