import { TbPhotoUp } from "react-icons/tb";
import Button from "../../../../components/ui/Button";
import Form from "../../../../components/ui/Form";
import InputField from "../../../../components/ui/InputField";
import { useProfile } from "../../../../hooks/features/settings/useProfile";
import Loader from "../../../../components/ui/Loader";
import { updateEmail } from "../../../../api/auth";
import { useUpdateProfile } from "../../../../hooks/features/settings/useUpdateProfile";
import { toast } from "react-toastify";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { uploadAvatar } from "../../../../api/profile";

function Account() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [localLoading, setLocalLoading] = useState(false);

  const { data: profile, isLoading } = useProfile();

  const { mutate, isPending } = useUpdateProfile();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  }

  function validatePhone(phone) {
    if (!phone.startsWith("+")) {
      return "Phone number must include country code";
    }

    if (phone.length === 1) {
      return "Phone number must contain digits";
    }

    if (!/^\d+$/.test(phone.slice(1))) {
      return "Phone number must contain only numbers";
    }

    if (phone.length < 8) {
      return "Phone number is too short";
    }

    return null;
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const updates = {};

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const username = formData.get("username");
    const phone = formData.get("phone");

    if (firstName && firstName !== profile.first_name) {
      updates.first_name = firstName;
    }

    if (lastName && lastName !== profile.last_name) {
      updates.last_name = lastName;
    }

    if (username && username !== profile.username) {
      updates.username = username;
    }

    if (phone && phone !== profile.phone) {
      const error = validatePhone(phone);

      if (error) {
        toast.error(error);
        setLocalLoading(false);
        return;
      }

      updates.phone = phone;
    }

    setLocalLoading(true);

    try {
      if (selectedFile) {
        const imageUrl = await uploadAvatar(selectedFile, profile.id);

        updates.avatar = imageUrl;
        setSelectedFile(null);
      }

      if (email && email !== profile.email) {
        await updateEmail(email);

        toast.info(`Email confirmation link has been sent to ${email}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLocalLoading(false);
    }

    if (Object.keys(updates).length > 0) {
      mutate(updates);
    }
  }

  function formatPhone(phone) {
    if (!phone) return;

    const codeLength = phone.length - 10;

    const code = phone.slice(0, codeLength);
    const firstSlice = phone.slice(codeLength, codeLength + 5);
    const lastSlice = phone.slice(codeLength + 5);

    return `${code} | ${firstSlice} ${lastSlice}`;
  }

  if (isLoading || isPending || localLoading) return <Loader />;

  return (
    <Form variant="settings" onSubmit={handleUpdateProfile}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 w-full">
        <div className="flex flex-col gap-6 w-full">
          <InputField
            variant="settings"
            id="firstName"
            label="First Name"
            placeholder={profile?.first_name}
            required={false}
          />
          <InputField
            variant="settings"
            id="lastName"
            label="Last Name"
            placeholder={profile?.last_name}
            required={false}
          />
          <InputField
            variant="settings"
            id="email"
            label="Email"
            type="email"
            placeholder={profile?.email}
            required={false}
          />
          <InputField
            variant="settings"
            id="username"
            label="Username"
            placeholder={profile?.username || "No username yet"}
            required={false}
          />
          <InputField
            variant="settings"
            id="phone"
            label="Phone Number"
            placeholder={formatPhone(profile?.phone) || "No phone number yet"}
            required={false}
          />
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="font-semibold text-notification">
            Your Profile Picture
          </p>

          {selectedFile ? (
            <div className="flex gap-3 items-center">
              <p className="text-sm text-primary">{selectedFile.name}</p>

              <button
                type="button"
                className="cursor-pointer text-red"
                onClick={() => setSelectedFile(null)}
              >
                <IoMdCloseCircle />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-4 p-6 border border-dashed rounded-lg cursor-pointer">
              <TbPhotoUp className="w-6 h-6 text-card" />
              <p className="w-20 text-center text-xs text-date">
                Upload your photo
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </div>

      <Button type="submit">Update Profile</Button>
    </Form>
  );
}

export default Account;
