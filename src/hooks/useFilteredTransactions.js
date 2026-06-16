export function useFilteredTransactions(transactions, activeTab) {
  return activeTab === "all"
    ? transactions
    : transactions?.filter((t) => t.transaction_type === activeTab);
}
