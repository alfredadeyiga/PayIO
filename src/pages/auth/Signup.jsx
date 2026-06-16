import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import GoogleButton from "../../components/ui/GoogleButton";
import Form from "../../components/ui/Form";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import FormDivider from "../../components/ui/FormDivider";
import Section from "../../components/layout/Section";
import { signup } from "../../api/auth";
import { useState } from "react";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loading, setLoading } = useAuth();

  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();

    setLoading(true);
    setEmailError("");
    setPasswordError("");

    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");
    const lastName = formData.get("lastName");
    const firstName = formData.get("firstName");

    try {
      await signup({ email, password, firstName, lastName });
      navigate("/dashboard/overview");
    } catch (err) {
      if (err.message.toLowerCase().includes("password")) {
        setPasswordError(err.message);
      } else if (err.message.toLowerCase().includes("user")) {
        setEmailError(err.message);
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
        Create an account
      </h2>

      <div className="w-full flex flex-col gap-6 items-center">
        <Form onSubmit={handleSignUp}>
          <InputField label="First Name" id="firstName" placeholder="John" />

          <InputField label="Last Name" id="lastName" placeholder="Doe" />

          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="hello@example.com"
            error={emailError}
          />

          <PasswordField label="Password" error={passwordError} />

          <Button type="submit" variant="secondary">
            {loading ? <Loader variant="button" /> : "Sign Up"}
          </Button>
        </Form>

        <FormDivider />

        <GoogleButton />
      </div>

      <p className="flex gap-1 text-placeholder">
        Already have an account?
        <span className="font-semibold text-primary">
          <Link to="/auth/login">Sign in here</Link>
        </span>
      </p>
    </Section>
  );
}

export default Signup;
