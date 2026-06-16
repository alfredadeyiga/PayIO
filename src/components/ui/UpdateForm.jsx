import Form from "./Form";
import InputField from "./InputField";

function UpdateForm({ onSubmit, id, label, placeholder }) {
  return (
    <Form variant="dashboard" onSubmit={onSubmit}>
      <InputField
        id={id}
        variant="dashboard"
        label={label}
        type="number"
        placeholder={placeholder}
      />
    </Form>
  );
}

export default UpdateForm;
