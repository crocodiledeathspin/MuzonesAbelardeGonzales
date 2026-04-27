import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "../contexts/SidebarContext";
import { HeaderProvider } from "../contexts/HeaderContext";

const LayoutContent = () => {
  return (
    <>
      <div>
        <AppSidebar />
      </div>
      <div>
        <AppHeader />
      </div>
      {/* Main Content Area */}
      <div className="pt-20 pl-0 sm:pl-64 min-h-screen">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div> {/* Added missing closing div */}
    </>
  );
};

const AppLayout = () => {
  return (
    <HeaderProvider>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </HeaderProvider>
  );
};

export default AppLayout;
