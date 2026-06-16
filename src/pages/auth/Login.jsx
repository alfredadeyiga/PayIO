import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import Button from "../../components/ui/Button";
import GoogleButton from "../../components/ui/GoogleButton";
import Form from "../../components/ui/Form";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import FormDivider from "../../components/ui/FormDivider";
import Section from "../../components/layout/Section";
import { login } from "../../api/auth";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [checked, setChecked] = useState(false);

  const { loading, setLoading } = useAuth();

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login({ email, password });
      navigate("/dashboard/overview");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section variant="auth" className={`${loading && "pointer-events-none"}`}>
      <div className="w-full flex flex-col gap-6 items-center">
        <Form onSubmit={handleLogin}>
          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="hello@example.com"
          />

          <PasswordField label="Password">
            <Link
              to="/auth/forgot-password"
              className="font-medium text-xs text-primary"
            >
              Forgot Password?
            </Link>
          </PasswordField>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setChecked((prev) => !prev)}
              >
                {checked ? (
                  <MdCheckBox className="w-5 h-5 text-primary" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5 text-border" />
                )}
              </button>

              <p className="text-secondary">Keep me signed in</p>
            </div>

            <Button type="submit" variant="secondary">
              {loading ? <Loader variant="button" /> : "Login"}
            </Button>
          </div>
        </Form>

        <FormDivider />

        <GoogleButton />
      </div>

      <Link to="/auth/signup" className="font-semibold text-primary">
        Create an account
      </Link>
    </Section>
  );
}

export default Login;
