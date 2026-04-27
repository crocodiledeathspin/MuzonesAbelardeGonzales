import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UserService from "../../../services/UserService";
import type { UserColumns } from "../../interfaces/UserColumns";

interface DeleteUserFormModalProps {
  user: UserColumns | null;
  onUserDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserFormModal: FC<DeleteUserFormModalProps> = ({
  user,
  onUserDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");

  const handleDestroyUser = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoadingDestroy(true);

      const res = await UserService.destroyUser(user?.user_id!);

      if (res.status === 200) {
        onUserDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error("Unexpected status error during deleting user: ", res.status);
      }
    } catch (error) {
      console.error("Unexpected server error during deleting user: ", error);
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    // Corrected logic: Load data when modal IS open and user exists
    if (isOpen && user) {
      setFirstName(user.first_name);
      setMiddleName(user.middle_name ?? "");
      setLastName(user.last_name);
      setSuffixName(user.suffix_name ?? "");
      setGender(user.gender?.gender ?? "N/A"); // Accessing nested gender object
      setBirthDate(user.birth_date);
      setUsername(user.username);
    }
  }, [isOpen, user]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDestroyUser} className="p-4">
        <h1 className="text-2xl border-b border-gray-100 pb-4 font-semibold mb-4">
          Delete User Form
        </h1>
        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4 pb-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">First Name</label>
              <p className="text-gray-500 font-medium">{firstName}</p>
            </div>
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">Middle Name</label>
              <p className="text-gray-500 font-medium">{middleName || "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">Last Name</label>
              <p className="text-gray-500 font-medium">{lastName}</p>
            </div>
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">Suffix Name</label>
              <p className="text-gray-500 font-medium">{suffixName || "N/A"}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">Gender</label>
              <p className="text-gray-500 font-medium">{gender}</p>
            </div>
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">Birth Date</label>
              <p className="text-gray-500 font-medium">{birthDate}</p>
            </div>
            <div className="mb-4">
              <label className="text-black font-medium mb-1 block">Username</label>
              <p className="text-gray-500 font-medium">{username}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            label="Delete User"
            loading={loadingDestroy}
            loadingLabel="Deleting User..."
             className="bg-red-500 hover:bg-red-700 text-white text-sm font-medium cursor-pointer py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteUserFormModal;
