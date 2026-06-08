import { NavLink, useLocation } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";
import { ChevronLeft, ChevronRight } from "lucide-react";

const activeClass =
  "bg-gray-200 border-l-4 border-[#7C3EFF] font-medium text-[#7C3EFF] bg-gray-300/70";
const inactiveClass = "hover:bg-gray-300/70";

const Sidebar = ({
  links = [],
  userName,
  role,
  isCollapsed = false,
  setIsCollapsed,
}) => {
  const location = useLocation();
  const baseClass = `w-full mt-1 rounded-r-lg transition-all duration-300 flex items-center ${
    isCollapsed ? "justify-center p-2" : "gap-3 p-3"
  }`;

  return (
    <nav
      className={`fixed top-0 left-0 h-screen bg-white overflow-y-auto rounded-2xl text-gray-700 shadow-lg flex flex-col justify-between transition-all duration-300 z-40
    ${isCollapsed ? "w-20 p-3" : "w-60 p-6"}`}
    >
      <div>
        {/* LOGO & TOGGLE BUTTON */}
        <div className={`flex items-center justify-between mb-6 ${isCollapsed ? "flex-col gap-3" : ""}`}>
          <div className="flex items-center">
            <img
              src="/image.png"
              alt="logo"
              className="w-10 h-10 rounded-full bg-violet-500 shrink-0"
            />
            {!isCollapsed && <h1 className="ml-2.5 text-xl font-bold text-gray-900 tracking-wide">HRIMS</h1>}
          </div>
          
          <button
            type="button"
            onClick={() => setIsCollapsed?.(!isCollapsed)}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-violet-600 transition shadow-sm cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <ul>
          {links.length > 0
            ? links.map((link) => {
                const Icon = link.icon;

                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={() => {
                        const isDashboard = link.end || link.to === "/hr-admin" || link.to === "/hr-staff" || link.to === "/supervisor" || link.to === "/intern" || link.to === "/applicant";
                        const isActive = isDashboard
                          ? location.pathname === link.to
                          : location.pathname.startsWith(link.to);
                        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
                      }}
                    >
                      {Icon && <Icon size={18} />}
                      {!isCollapsed && (
                        <span className="truncate">{link.label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })
            : !isCollapsed && (
                <p className="text-sm text-gray-400">No navigation available</p>
              )}
        </ul>
      </div>

      {/* PROFILE ROLE */}
      <SidebarProfile
        isCollapsed={isCollapsed}
        passedUserName={userName}
        passedRole={role}
      />
    </nav>
  );
};

export default Sidebar;
