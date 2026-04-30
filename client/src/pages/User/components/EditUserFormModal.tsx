import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Inputs/FloatingLabelInput";
import UploadInput from "../../../components/Inputs/UploadingInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import type { UserColumns } from "../../../interfaces/UserColumns";
import type { GenderColumns } from "../../../interfaces/GenderColumns";
import type { UserFieldErrors } from "../../../interfaces/UserFieldErrors";
import GenderService from "../../../services/GenderService";
import UserService from "../../../services/UserService";

interface EditUserFormModalProps {
  user: UserColumns | null;
  onUserUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditUserFormModal: FC<EditUserFormModalProps> = ({
  user,
  onUserUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [editUserProfilePicture, setEditUserProfilePicture] = useState<File | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleUpdateUser = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoadingUpdate(true);

const formData = new FormData();

      if (editUserProfilePicture) {
        formData.append("edit_user_profile_picture", editUserProfilePicture);
      }

      if (removeExistingImage && existingProfilePicture) {
        formData.append("remove_profile_picture", "1");
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName  || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName  || "");
      formData.append("gender", gender);
      formData.append("birth_date", birthDate);
      formData.append("username", username);

      const res = await UserService.updateUser(user?.user_id!, formData);

      if (res.status === 200) {
        onUserUpdated(res.data.message);
        refreshKey();
        onClose();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected update error: ", error);
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Error loading genders: ", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && user) {
      setFirstName(user.first_name);
setMiddleName(user.middle_name ?? "");
      setLastName(user.last_name);
setSuffixName(user.suffix_name ?? "");
setGender(user.gender.gender_id.toString());
      setBirthDate(user.birth_date);
      setUsername(user.username);
      setEditUserProfilePicture(null);
      setExistingProfilePicture(user.profile_picture ? user.profile_picture : null);
      setRemoveExistingImage(false);
    }
  }, [isOpen, user]);

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleUpdateUser}>
        <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
          Edit User Form
        </h1>
        <div className="mb-4">
          <UploadInput
            label="Profile Picture"
            name="edit_user_profile_picture"
            value={editUserProfilePicture}
            onChange={setEditUserProfilePicture}
            existingImageUrl={existingProfilePicture}
            onRemoveExistingImageUrl={() => {
              setRemoveExistingImage(true);
              setExistingProfilePicture(null);
            }}
errors={errors.edit_profile_picture}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="First Name"
                type="text"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoFocus
                errors={errors.first_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Middle Name"
                type="text"
                name="middle_name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                errors={errors.middle_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Last Name"
                type="text"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                errors={errors.last_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Suffix Name"
                type="text"
                name="suffix_name"
                value={suffixName}
                onChange={(e) => setSuffixName(e.target.value)}
                errors={errors.suffix_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelSelect 
                label="Gender" 
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                errors={errors.gender}
              >
                {loadingGenders ? (
                  <option value="">Loading...</option>
                ) : (
                  <>
                    <option value="">Select Gender</option>
                    {genders.map((gender, index) => (
                      <option value={gender.gender_id} key={index}>
                        {gender.gender}
                      </option>
                    ))}
                  </>
                )}
              </FloatingLabelSelect>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="Birth Date"
                type="date"
                name="birth_date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                errors={errors.birth_date}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                errors={errors.username}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <CloseButton label="Close" onClose={onClose} />
          <SubmitButton label="Update User" loading={loadingUpdate} loadingLabel="Updating User" />
        </div>
      </form>
    </Modal>
  </>
  );
};

export default EditUserFormModal;
