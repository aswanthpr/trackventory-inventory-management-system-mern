import {ChevronUpIcon, FileDownIcon, Inbox,User, User2 } from "lucide-react"
 
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "./ui/sidebar"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"
  // Menu items.
  const items = [
    {
        title: " Inventory",
        url: "http://localhost:5173/",
        icon:<Inbox/>,
      },
    {
      title: "Customer",
      url: "http://localhost:5173/customer-mgt",
      icon:<User/>,
    },
    {
      title: "Sales",
      url:"http://localhost:5173/sales-mgt",
      icon:<FileDownIcon/> ,
    },
  ]
   
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl font-bold mb-4 ">TrackVentory</SidebarGroupLabel>
           
            <SidebarGroupContent>
              <SidebarMenu className="mb-4" >
                {items.map((item) => (
                  <SidebarMenuItem key={item?.title} className="p-2 border border-gray-100">
                    <SidebarMenuButton asChild>
                      <a href={item?.url} className="hover:bg-gray-100 ">
                         <div className="w-6 ">{item.icon}</div>
                        <span  className="text-lg font-semibold ">{item?.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
         <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2">
                  <User2 />
                  Username
                  <ChevronUpIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
               
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      </Sidebar>
    )
  }