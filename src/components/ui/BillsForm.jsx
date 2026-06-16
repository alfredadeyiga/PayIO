import { toast } from "react-toastify";
import { useAddBills } from "../../hooks/features/bills/useAddBills";
import { useUpdateBills } from "../../hooks/features/bills/useUpdateBills";
import DateField from "./DateField";
import Form from "./Form";
import InputField from "./InputField";
import { useBills } from "../../hooks/features/bills/useBills";

function BillsForm({ currentId }) {
  const { mutate: addBill } = useAddBills();

  const { mutate: updateBill } = useUpdateBills();

  const { data: bills } = useBills();

  const currentBill = bills?.find((bill) => bill.id === currentId);

  function handleUpsertBill(e) {
    e.preventDefault();

    const data = {};

    const formData = new FormData(e.target);

    const billName = formData.get("title");
    const description = formData.get("description");
    const amount = Number(formData.get("amount"));
    const lastCharge = formData.get("lastCharge");
    const dueDate = formData.get("dueDate");

    if (billName && billName !== currentBill?.bill_name) {
      data.bill_name = billName;
    }

    if (description && description !== currentBill?.description) {
      data.description = description;
    }

    if (amount && amount !== currentBill?.amount) {
      data.amount = amount;
    }

    if (lastCharge && lastCharge !== currentBill?.last_charge) {
      data.last_charge = lastCharge;
    }

    if (dueDate && dueDate !== currentBill?.due_date) {
      data.due_date = dueDate;
    }

    if (currentId) {
      if (Object.keys(data).length === 0) {
        toast.info("No changes were made");
        return;
      }

      updateBill({ id: currentId, updates: data });
    } else {
      addBill(data);
    }
  }

  return (
    <Form variant="dashboard" onSubmit={handleUpsertBill}>
      <InputField
        id="title"
        variant="dashboard"
        label="Bill Name"
        placeholder={currentBill?.bill_name ?? "Figma - Yearly"}
        required={!currentId}
      />
      <DateField
        id="dueDate"
        label="Due Date"
        required={!currentId}
        defaultValue={currentBill?.due_date ?? ""}
      />
      <InputField
        id="amount"
        variant="dashboard"
        label="Amount"
        type="number"
        placeholder={`$${currentBill?.amount ?? 150}`}
        required={!currentId}
      />
      <InputField
        id="description"
        variant="dashboard"
        label="Description"
        placeholder={
          currentBill?.description ??
          "For advanced security and more flexible controls,"
        }
        required={!currentId}
      />
      <DateField
        id="lastCharge"
        variant="last"
        label="Last Charge"
        required={!currentId}
        defaultValue={currentBill?.last_charge ?? ""}
      />
    </Form>
  );
}

export default BillsForm;
