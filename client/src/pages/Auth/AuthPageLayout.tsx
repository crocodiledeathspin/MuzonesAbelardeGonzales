import type { FC, ReactNode } from 'react';
// import GroupLogo from "../../../assets/img/GroupLogo.png";

interface AuthPageLayoutProps {
    children: ReactNode
}
const AuthPageLayout: FC<AuthPageLayoutProps> = ({ children }) => {
    return (
        <>
            <div className="min-h-screen flex flex-row bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 py-8">
                    <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex flex-col items-center mb-8">
                            <div className="mb-4 p-3 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl">
<img className="w-12 h-12 rounded-lg drop-shadow-lg" src="https://www.logodee.com/wp-content/uploads/2022/11/Professional-corporate-business-logo-design.jpg" alt="Logo" />
                            </div>
                            <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Sign in to your account
                            </h2>
                            <p className="text-gray-500 text-sm mt-2">Welcome back to your dashboard</p>
                        </div>
                        {children}
                    </div>
                </div>
                <div className='hidden lg:flex w-1/2 h-screen items-center justify-center bg-linear-to-br from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden'>
                    <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent"></div>
                    <img className='object-contain w-full h-full relative z-10 drop-shadow-2xl brightness-110 contrast-110 bg-white/20 rounded-xl backdrop-blur-sm p-4'
                        src="https://www.logodee.com/wp-content/uploads/2022/11/Professional-corporate-business-logo-design.jpg"
                        alt="Logo" />
                </div>
            </div>

        </>
    )
}

export default AuthPageLayout