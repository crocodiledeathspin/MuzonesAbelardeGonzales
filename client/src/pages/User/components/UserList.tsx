import { useEffect, useState, type FC } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/table";
import type { UserColumns } from "../../../interfaces/UserColumns"
import UserService from "../../../services/UserService"
import Spinner from "../../../components/Spinner/Spinner"
import { Link } from "react-router-dom";
import FloatingLabelInput from "../../../components/Inputs/FloatingLabelInput";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: UserColumns | null) => void;
    onDeleteUser: (user: UserColumns | null) => void;
    refreshKey: boolean;
}

const UserList: FC<UserListProps> = ({ onAddUser, onEditUser, onDeleteUser, refreshKey }) => {
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [users, setUsers] = useState<UserColumns[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 800);

        return () => clearTimeout(timer);
    }, [search]);


    const handleLoadUsers = async (page: number, append = false, searchTerm: string) => {
        try {
            if (!append) {
                setLoadingUsers(true);
            } else {
                setLoadingMore(true);
            }

            const res = await UserService.loadUsers(page, searchTerm);

            if (res.status === 200) {
                const newUsers = Array.isArray(res.data.users) ? res.data.users : [];
                setHasMore(res.data.has_more_pages || false);
                if (append) {
                    setUsers(prev => [...prev, ...newUsers]);
                } else {
                    setUsers(newUsers);
                    setCurrentPage(page);
                }
            } else {
                console.error(
                    "Unexpected status error occurred during loading users: ",
                    res.status
                );
            }
        } catch (error) {
            console.error(
                "Unexpected server error occurred during loading users: ",
                error
            );
        } finally {
            setLoadingUsers(false);
            setLoadingMore(false);
        }
    };

    const handleUserFullNameFormat = (user: UserColumns) => {
        let fullName = "";

        if (user.middle_name) {
            fullName = `${user.last_name}, ${
                user.first_name
            } ${user.middle_name.charAt(0)}.`;
        } else {
            fullName = `${user.last_name}, ${user.first_name}`;
        }

        if (user.suffix_name) {
            fullName += ` ${user.suffix_name}`;
        }

        return fullName;
    };

    // Remove client-side filtering - server handles it now

    // Load initial page and on search/debounce/refresh
    useEffect(() => {
        handleLoadUsers(1, false, debouncedSearch);
    }, [refreshKey, debouncedSearch]);

    // Infinite scroll
    const loadMoreUsers = () => {
        if (hasMore && !loadingMore && !loadingUsers) {
            handleLoadUsers(currentPage + 1, true, debouncedSearch);
        }
    };

    useEffect(() => {
        const tableContainer = document.querySelector('.overflow-x-auto') as HTMLElement;
        if (!tableContainer) return;

        const handleScroll = () => {
            if (tableContainer.scrollHeight - tableContainer.scrollTop <= tableContainer.clientHeight + 100) {
                loadMoreUsers();
            }
        };

        tableContainer.addEventListener('scroll', handleScroll);
        return () => tableContainer.removeEventListener('scroll', handleScroll);
    }, [currentPage, hasMore, loadingMore, loadingUsers, debouncedSearch]);

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                    <Table>
                        <caption className="mb-4">
                            <div className="border-b border-gray-100">
                                <div className="p-4 flex justify-between">
                                    <div className="w-64">
                                        <FloatingLabelInput label="Search" type="text" name="search_auto" autoFocus value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer"
                                        onClick={onAddUser}
                                    >
                                        Add User
                                    </button>
                                </div>
                            </div>
                        </caption>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-center"
                                >
                                    No.
                                </TableCell>
                                <TableCell
                                    isHeader
                                    colSpan={2}
                                    className="px-5 py-3 font-medium text-start"
                                >
                                    Full Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-start"
                                >
                                    Gender
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-start"
                                >
                                    Birth Date
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-start"
                                >
                                    Age
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-start"
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                            {loadingUsers ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-4 py-3 text-center">
                                        <Spinner size="md" />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-4 py-3 text-center text-gray-500">
                                        {debouncedSearch ? `No users found for "${debouncedSearch}"` : "No users found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user: UserColumns, index: number) => (
                                    <TableRow className="hover:bg-gray-100" key={index}>
                                        <TableCell className="px-4 py-3 text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-end">
                                            {user.profile_picture ? (
                                                <img
                                                    src={user.profile_picture}
                                                    alt={handleUserFullNameFormat(user)}
                                                    className="object-cover w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm overflow-hidden bg-gray-300 rounded-full">
                                                    <span className="font-medium text-gray-600">
                                                        {`${user.last_name.charAt(0)}${user.first_name.charAt(0)}`}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {handleUserFullNameFormat(user)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {user.gender.gender}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {user.birth_date}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {user.age}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    className="text-green-600 hover:underline"
                                                    onClick={() => onEditUser(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-red-600 hover:underline"
                                                    onClick={() => onDeleteUser(user)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}

                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default UserList;
