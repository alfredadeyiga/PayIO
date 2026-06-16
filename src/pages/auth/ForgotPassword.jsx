import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Form from "../../components/ui/Form";
import InputField from "../../components/ui/InputField";
import Section from "../../components/layout/Section";
import Loader from "../../components/ui/Loader";
import { sendResetLink } from "../../api/auth";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function ForgotPassword() {
  const { loading, setLoading } = useAuth();

  async function handleSendEmail(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const email = formData.get("email");

    try {
      await sendResetLink(email);
      toast.info("A reset link has been sent to your email");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section variant="auth" className={`${loading && "pointer-events-none"}`}>
      <div className="flex flex-col text-center gap-3">
        <h2 className="font-semibold text-secondary text-xl md:text-2xl">
          Forgot Password?
        </h2>

        <p className="md:text-lg text-notification">
          Enter your account email address to get the password reset link
        </p>
      </div>

      <div className="w-full flex flex-col gap-6 items-center">
        <Form onSubmit={handleSendEmail}>
          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="hello@example.com"
          />

          <Button type="submit" variant="secondary">
            {loading ? <Loader variant="button" /> : "Send Email"}
          </Button>
        </Form>

        <Link to="/auth/login" className="font-semibold text-placeholder">
          Back to login
        </Link>
      </div>
    </Section>
  );
}

export default ForgotPassword;
