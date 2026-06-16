import { FcGoogle } from "react-icons/fc";
import Button from "./Button";
import { googleSignIn } from "../../api/auth";
import { toast } from "react-toastify";

function GoogleButton() {
  async function handleSignIn() {
    try {
      await googleSignIn();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Button type="button" variant="social" onClick={handleSignIn}>
      <FcGoogle className="w-6 h-6" />
      Continue with Google
    </Button>
  );
}

export default GoogleButton;
