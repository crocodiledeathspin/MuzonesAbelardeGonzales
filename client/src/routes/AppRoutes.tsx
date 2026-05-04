import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import GenderMainPage from "../pages/Gender/GenderMainPage";
import EditGenderPage from "../pages/Gender/EditGenderPage";
import DeleteGenderPage from "../pages/Gender/DeleteGenderPage";
import UserMainPage from "../pages/User/UserMainPage";
import LoginPage from "../pages/Auth/LoginPage";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ToastMessage from "../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../hooks/useToastMessage";
import AuthPageLayout from "../pages/Auth/AuthPageLayout";
import LoginForm from "../pages/Auth/components/LoginForm";

const AppRoutes = () => {
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/genders" element={<GenderMainPage />} />
                        <Route
                            path="/gender/edit/:gender_id"
                            element={<EditGenderPage />}
                        />
                        <Route
                            path="/gender/delete/:gender_id"
                            element={<DeleteGenderPage />}
                        />
                        <Route path="/users" element={<UserMainPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </>
    );
};


export default AppRoutes;