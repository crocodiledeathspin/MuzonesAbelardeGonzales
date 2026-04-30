import { useEffect, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Inputs/FloatingLabelInput";
import UploadInput from "../../../components/Inputs/UploadingInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import type { UserColumns } from "../../../interfaces/UserColumns";
import type { GenderColumns } from "../../../interfaces/GenderColumns";
import GenderService from "../../../services/GenderService";
import type { UserFieldErrors } from "../../../interfaces/UserFieldErrors";
import UserService from "../../../services/UserService";

interface AddUserFormModalProps {
    onUserAdded: (message: string) => void;
    isOpen: boolean;
    onClose: () => void;
    refreshKey?: () => void;
}

const AddUserFormModal: FC<AddUserFormModalProps> = ({ onUserAdded, isOpen, onClose, refreshKey }) => {
    const [loadingGenders, setLoadingGenders] = useState(false);
    const [genders, setGenders] = useState<GenderColumns[]>([]);

    const [loadingStore, setLoadingStore] = useState(false);
    const [addUserProfilePicture, setAddUserProfilePicture] = useState<File | null>(null);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [suffixName, setSuffixName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<UserFieldErrors>({});

    const handleStoreUser = async (e: FormEvent) => {
        try {
            e.preventDefault();
            setLoadingStore(true);
            
            const formData = new FormData();
            
            if (addUserProfilePicture) {
                formData.append("add_user_profile_picture", addUserProfilePicture)
            }

            formData.append("first_name", firstName);
            formData.append("middle_name", middleName  || "");
            formData.append("last_name", lastName);
            formData.append("suffix_name", suffixName  || "");
            formData.append("gender", gender);
            formData.append("birth_date", birthDate);
            formData.append("username", username);
            formData.append("password", password);
            formData.append("password_confirmation", passwordConfirmation);

            const res = await UserService.storeUser(formData);

            if (res.status === 200) {
                setAddUserProfilePicture(null);
                onUserAdded(res.data.message);
                refreshKey?.();

                setFirstName("");
                setMiddleName("");
                setLastName("");
                setSuffixName("");
                setGender("");
                setBirthDate("");
                setUsername("");
                setPassword("");
                setPasswordConfirmation("");
                setErrors({});

                onClose();
            } else {
                console.error("Unexpected status error occurred during adding user: ", res.status);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.log("Unexpected server error occurred during adding user: ", error);
            }
        } finally {
            setLoadingStore(false);
        }
    };

    const handleLoadGenders = async () => {
        try {
            setLoadingGenders(true);
            const res = await GenderService.loadGenders();
            if (res.status === 200) {
                setGenders(res.data.genders);
            } else {
                console.error("Unexpected status error occurred during loading genders: ", res.status);
            }
        } catch (error) {
            console.error("Unexpected server error occurred during loading genders: ", error);
        } finally {
            setLoadingGenders(false);
        }
    };

    useEffect(() => {
        if (isOpen){
         handleLoadGenders();
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form onSubmit={handleStoreUser}>
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add User Form
                </h1>
                <div className="mb4">
                    <UploadInput label="Profile Picture" name="add_user_profile_picture" value={addUserProfilePicture} 
onChange={setAddUserProfilePicture} errors={errors.add_user_profile_picture}
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
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                errors={errors.password}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Password Confirmation"
                                type="password"
                                name="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                errors={errors.password_confirmation}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Save User" loading={loadingStore} loadingLabel="Saving User" />
                </div>
            </form>
        </Modal>
    );
};

export default AddUserFormModal;
