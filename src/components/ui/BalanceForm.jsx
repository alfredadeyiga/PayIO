import { useEffect, useRef, useState } from "react";
import { useAddBalance } from "../../hooks/features/balances/useAddBalance";
import Form from "./Form";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { generateCard, getCardTypes } from "../../api/cards";
import { toast } from "react-toastify";
import CustomCardUI from "./CustomCardUI";
import { useModal } from "../../context/ModalContext";
import { faker } from "@faker-js/faker";
import { formatAddress } from "../../utils/formatAddress";
import { accountOptions } from "../../constants/accountOptions";

function BalanceForm() {
  const [accountOption, setAccountOption] = useState("credit_card");
  const [brandOption, setBrandOption] = useState("mastercard");

  const defaultCardOptions = [
    {
      value: "visa",
      label: <CustomCardUI value="VISA" />,
    },
    {
      value: "mastercard",
      label: <CustomCardUI value="MasterCard" />,
    },
  ];

  const [cardOptions, setCardOptions] = useState(defaultCardOptions);

  const { setModalState } = useModal();

  useEffect(() => {
    async function getCardOptions() {
      try {
        const data = await getCardTypes();

        const options = data.types.map((type) => ({
          value: type.key,
          label: <CustomCardUI value={type.name} />,
        }));

        setCardOptions(options);
      } catch (error) {
        toast.error("Error retrieving card types");
      }
    }

    getCardOptions();
  }, []);

  const accountRef = useRef();

  const cardRef = useRef();

  const { mutate } = useAddBalance();

  const isCard = accountOption.includes("card");

  async function handleAddBalance(e) {
    e.preventDefault();

    const data = [];

    const formData = new FormData(e.target);

    const service = formData.get("service");
    const balance = Number(formData.get("balance"));

    data.type = accountOptions.find((opt) => opt.value === accountOption).label;

    data.total = balance;

    if (isCard) {
      try {
        const res = await generateCard(brandOption);

        const cardData = res.cards[0];

        data.account_number = cardData.number;

        data.service = cardOptions.find(
          (opt) => opt.value === brandOption,
        ).label.props.value;

        data.branch_name = `${formatAddress(cardData.address)} Branch`;
      } catch (error) {
        toast.error("Error generating card data");
      } finally {
        setModalState({ isLoading: false });
      }
    } else {
      data.account_number = faker.finance.accountNumber(10);

      data.service = service;

      data.branch_name = `${formatAddress(faker.location.streetAddress())} Branch`;
    }

    mutate(data);
  }

  return (
    <Form variant="dashboard" onSubmit={handleAddBalance}>
      <SelectField
        ref={accountRef}
        label="Account Type"
        options={accountOptions}
        selectedOption={accountOption}
        setSelectedOption={(option) => setAccountOption(option)}
      />
      {isCard ? (
        <SelectField
          ref={cardRef}
          label="Card Type"
          options={cardOptions}
          selectedOption={brandOption}
          setSelectedOption={(option) => setBrandOption(option)}
        />
      ) : (
        <InputField
          id="service"
          variant="dashboard"
          label="Bank or Service Name"
          placeholder="City Bank Ltd."
        />
      )}
      <InputField
        id="balance"
        variant="dashboard"
        label="Balance"
        type="number"
        placeholder="$25000"
      />
    </Form>
  );
}

export default BalanceForm;
