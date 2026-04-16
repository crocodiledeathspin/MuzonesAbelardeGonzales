import type  { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/table";

interface UserListProps {
  onAddUser: () => void;
}

const UserList: FC<UserListProps> = ({ onAddUser }) => {
  const users = [
    {
      user_id: 1,
      first_name: "John",
      middle_name: "",
      last_name: "Doe",
      suffix_name: "",
      gender: "Male",
      address: "Roxas City",
      action: (
        <div className="flex gap-4">
          <button className="text-green-600 hover:underline">Edit</button>
          <button className="text-red-600 hover:underline">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
        <Table>
          <caption className="mb-4">
            <div className="border-b border-gray-100">
              <div className="p-4 flex justify-end">
                <button
                  onClick={onAddUser}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition"
                >
                  Add User
                </button>
              </div>
            </div>
          </caption>

          <TableHeader className="border-b bg-blue-600 text-white text-xs">
            <TableRow>
              <TableCell isHeader>No.</TableCell>
              <TableCell isHeader>First Name</TableCell>
              <TableCell isHeader>Middle Name</TableCell>
              <TableCell isHeader>Last Name</TableCell>
              <TableCell isHeader>Suffix</TableCell>
              <TableCell isHeader>Address</TableCell>
              <TableCell isHeader>Gender</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.middle_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.suffix_name}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;