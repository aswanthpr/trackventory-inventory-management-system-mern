import { Outlet } from "react-router-dom";
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export  function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {/* {children} */}
        <Outlet/>
      </main>
    </SidebarProvider>
  )
}