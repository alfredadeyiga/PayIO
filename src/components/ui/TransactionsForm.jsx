import { useRef, useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import CustomPaymentUI from "./CustomPaymentUI";
import Form from "./Form";
import { useAddTransaction } from "../../hooks/features/transactions/useAddTransaction";
import { useUpdateTransaction } from "../../hooks/features/transactions/useUpdateTransaction";
import { generateReceipt } from "../../utils/generateReceipt";
import { useBalances } from "../../hooks/features/balances/useBalances";
import { useUpdateBalance } from "../../hooks/features/balances/useUpdateBalance";
import { toast } from "react-toastify";
import { accountOptions } from "../../constants/accountOptions";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { categoryOptions } from "../../constants/categoryOptions";

function TransactionsForm({ currentId }) {
  const { data: transactions } = useTransactions();

  const currentTx = transactions?.find((tx) => tx.id === currentId);

  const [categoryOption, setCategoryOption] = useState(
    currentTx?.category ?? "shopping",
  );
  const [transactionOption, setTransactionOption] = useState(
    currentTx?.transaction_type ?? "revenue",
  );
  const [paymentOption, setPaymentOption] = useState(null);

  const categoryRef = useRef();

  const paymentRef = useRef();

  const transactionRef = useRef();

  const { mutate: addTransaction } = useAddTransaction();

  const { mutate: updateBalance } = useUpdateBalance();

  const { mutate: updateTransaction } = useUpdateTransaction();

  const { data: balances } = useBalances();

  const selectedPaymentOption =
    currentTx?.payment_id ??
    paymentOption ??
    balances?.[0]?.id ??
    "credit_card";

  const balanceOptions = balances?.map((balance) => ({
    value: balance.id,
    label: <CustomPaymentUI card={balance} />,
    displayLabel: balance.type,
    total: balance.total,
  }));

  const paymentOptions =
    balanceOptions?.length > 0 ? balanceOptions : accountOptions;

  const transactionOptions = [
    { value: "revenue", label: "Revenue" },
    { value: "expenses", label: "Expenses" },
  ];

  function handleUpsertTransaction(e) {
    e.preventDefault();

    const data = {};

    const formData = new FormData(e.target);

    const amount = Number(formData.get("amount"));

    const itemName = formData.get("itemName");

    const shopName = formData.get("shopName");

    const paymentMethod = paymentOptions.find(
      (b) => b.value === selectedPaymentOption,
    );

    const hasTotal = "total" in paymentMethod;

    const currentBalance = paymentMethod?.total ?? 0;

    const oldAmount = currentTx?.amount ?? 0;
    const oldType = currentTx?.transaction_type;
    const newAmount = amount || oldAmount;
    const newType = transactionOption;

    let updatedBalance = currentBalance;

    if (oldType === "revenue") {
      updatedBalance -= oldAmount;
    } else if (oldType === "expenses") {
      updatedBalance += oldAmount;
    }

    if (newType === "revenue") {
      updatedBalance += newAmount;
    } else if (newType === "expenses") {
      updatedBalance -= newAmount;
    }

    if (hasTotal && updatedBalance < 0) {
      toast.info("Amount cannot be greated than account balance");
      return;
    }

    if (currentId) {
      if (itemName && itemName !== currentTx.item_name) {
        data.item_name = itemName;
      }

      if (shopName && shopName !== currentTx.shop_name) {
        data.shop_name = shopName;
      }

      if (amount && amount !== currentTx.amount) {
        data.amount = amount;
      }

      if (transactionOption !== currentTx.transaction_type) {
        data.transaction_type = transactionOption;
      }

      if (categoryOption !== currentTx.category) {
        data.category = categoryOption;
      }

      if (Object.keys(data).length === 0) {
        toast.info("No changes were made");
        return;
      }

      updateTransaction(
        { id: currentId, updates: data },
        {
          onSuccess: () => {
            if (hasTotal) {
              updateBalance({
                id: selectedPaymentOption,
                total: updatedBalance,
              });
            }
          },
        },
      );
    } else {
      addTransaction(
        {
          item_name: itemName,
          shop_name: shopName,
          amount,
          date: new Date(),
          transaction_type: transactionOption,
          category: categoryOption,
          payment_method: paymentMethod.displayLabel || paymentMethod.label,
          payment_id: hasTotal ? selectedPaymentOption : null,
          receipt: generateReceipt(),
        },
        {
          onSuccess: () => {
            if (hasTotal) {
              updateBalance({
                id: selectedPaymentOption,
                total: updatedBalance,
              });
            }
          },
        },
      );
    }
  }

  return (
    <Form variant="dashboard" onSubmit={handleUpsertTransaction}>
      <InputField
        id="itemName"
        variant="dashboard"
        label="Item Name"
        placeholder={currentTx?.item_name ?? "Polo Shirt"}
        required={!currentId}
      />
      <SelectField
        ref={categoryRef}
        label="Category"
        options={categoryOptions}
        selectedOption={categoryOption}
        setSelectedOption={(option) => setCategoryOption(option)}
      />
      <InputField
        id="shopName"
        variant="dashboard"
        label="Shop Name"
        placeholder={currentTx?.shop_name ?? "XL Fashions"}
        required={!currentId}
      />
      <SelectField
        ref={transactionRef}
        label="Transaction Type"
        options={transactionOptions}
        selectedOption={transactionOption}
        setSelectedOption={(option) => setTransactionOption(option)}
      />
      {!currentId && (
        <SelectField
          ref={paymentRef}
          label="Payment Method"
          options={paymentOptions.length > 0 ? paymentOptions : accountOptions}
          selectedOption={selectedPaymentOption}
          setSelectedOption={(option) => setPaymentOption(option)}
        />
      )}
      <InputField
        id="amount"
        variant="dashboard"
        label="Amount"
        type="number"
        placeholder={`$${currentTx?.amount ?? 160}`}
        required={!currentId}
      />
    </Form>
  );
}

export default TransactionsForm;
