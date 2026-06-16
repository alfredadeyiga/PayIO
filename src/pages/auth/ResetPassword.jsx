import Button from "../../components/ui/Button";
import Form from "../../components/ui/Form";
import PasswordField from "../../components/ui/PasswordField";
import Section from "../../components/layout/Section";
import { useEffect, useState } from "react";
import Loader from "../../components/ui/Loader";
import { logout, updatePassword } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ResetPassword() {
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const { loading, setLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Reset Password";
  }, []);

  async function handleResetPassword(e) {
    e.preventDefault();

    setLoading(true);
    setNewError("");
    setConfirmError("");

    const formData = new FormData(e.target);

    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (confirmPassword !== newPassword) {
      setConfirmError("Must match new password");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      await logout();
      toast.success("Password changed successfully");
      navigate("/auth/login");
    } catch (err) {
      if (err.message.toLowerCase().includes("password")) {
        setNewError(err.message);
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section variant="auth" className={`${loading && "pointer-events-none"}`}>
      <h2 className="font-semibold text-secondary text-xl md:text-2xl">
        Reset Password
      </h2>

      <Form onSubmit={handleResetPassword}>
        <PasswordField id="newPassword" label="New Password" error={newError} />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          error={confirmError}
        />

        <Button type="submit" variant="secondary">
          {loading ? <Loader variant="button" /> : "Reset Password"}
        </Button>
      </Form>
    </Section>
  );
}

export default ResetPassword;
