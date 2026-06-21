import { toast } from "react-toastify";
import { updateCurrentPassword } from "../../../../api/auth";
import Button from "../../../../components/ui/Button";
import Form from "../../../../components/ui/Form";
import Loader from "../../../../components/ui/Loader";
import PasswordField from "../../../../components/ui/PasswordField";
import { createNotification } from "../../../../api/notification";
import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";

function Security() {
  const [localLoading, setLocalLoading] = useState(false);

  const { user } = useAuth();

  async function handleUpdatePassword(e) {
    e.preventDefault();

    setLocalLoading(true);

    const formData = new FormData(e.target);

    const password = formData.get("password");
    const currentPassword = formData.get("currentPassword");
    const retypePassword = formData.get("retypePassword");

    if (retypePassword !== password) {
      toast.error("Confirm password must match new password");
      setLocalLoading(false);
      return;
    }

    try {
      await updateCurrentPassword({
        password,
        currentPassword,
      });

      toast.success("Your password has been updated");

      createNotification({
        userId: user.id,
        message: "Your account has been updated",
        description: "Your password was updated successfully",
      });
    } catch (err) {
      if (err.message.includes("Current password")) {
        toast.error("Current password is incorrect");
        return;
      }

      toast.error(err.message);
    } finally {
      setLocalLoading(false);
    }
  }

  if (localLoading) return <Loader />;

  return (
    <Form variant="settings" onSubmit={handleUpdatePassword}>
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <PasswordField
          variant="settings"
          id="currentPassword"
          label="Current Password"
        />
        <PasswordField variant="settings" label="New Password" />
        <PasswordField
          variant="settings"
          id="retypePassword"
          label="Retype Password"
        />
      </div>

      <Button type="submit">Update Password</Button>
    </Form>
  );
}

export default Security;
