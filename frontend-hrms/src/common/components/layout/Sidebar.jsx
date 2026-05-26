import { NavLink } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";

const activeClass =
  "bg-gray-200 border-l-4 border-[#7C3EFF] font-medium text-[#7C3EFF] bg-gray-300/70";
const inactiveClass = "hover:bg-gray-300/70";

const Sidebar = ({
  links = [],
  userName,
  role,
  isCollapsed,
  setIsCollapsed,
}) => {
  const baseClass = `w-full p-3 mt-1 rounded-r-lg transition-colors duration-300 flex items-center gap-3 ${
    isCollapsed ? "justify-center" : "gap-3"
  }`;

  const getNavClass = ({ isActive }) =>
    `${baseClass} ${isActive ? activeClass : inactiveClass}`;

  return (
    <nav
      className={`fixed top-0 left-0 h-screen bg-white overflow-y-auto rounded-2xl text-gray-700 shadow-lg flex flex-col justify-between transition-all duration-300
    ${isCollapsed ? "w-24 p-4" : "w-60 p-7"}`}
    >
      <div>
        {/* LOGO */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center text-4xl font-medium mb-6 w-full ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <img
            src="/image.png"
            alt="logo"
            className="w-12 h-12 rounded-full bg-violet-500"
          />
          {!isCollapsed && <h1 className="ml-2">HRIMS</h1>}
        </button>

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
                      className={getNavClass}
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
