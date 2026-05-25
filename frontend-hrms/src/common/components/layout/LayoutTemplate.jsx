import {
  Navigate,
  Outlet,
  useLocation,
  matchPath,
  useNavigate,
} from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { navigation } from "../../config/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect } from "react";

export default function LayoutTemplate({ headerConfig }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pageHeader, setPageHeader] = useState(null);

  useEffect(() => {
    setPageHeader(null);
  }, [location.pathname]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const roleMap = {
    INTERN: "intern",
    SUPERVISOR: "supervisor",
    HR_STAFF: "hr-staff",
    ADMIN: "hr-admin",
  };

  const userRole = roleMap[currentUser.role];

  const matchedHeaderKey = Object.keys(headerConfig).find((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  const match = matchedHeaderKey
    ? matchPath({ path: matchedHeaderKey, end: true }, location.pathname)
    : null;

  const usersDb = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");

  const currentHeader = matchedHeaderKey
    ? headerConfig[matchedHeaderKey]
    : {
        title: "Dashboard",
        subtitle: "",
      };

  const defaultTitle = currentHeader.getTitle
    ? currentHeader.getTitle({
        currentUser,
        params: match?.params || {},
        usersDb,
      })
    : currentHeader.title;

  const defaultSubtitle = currentHeader.getSubtitle
    ? currentHeader.getSubtitle({
        currentUser,
        params: match?.params || {},
        usersDb,
      })
    : currentHeader.subtitle;

  const headerTitle = pageHeader?.title ?? defaultTitle;
  const headerSubtitle = pageHeader?.subtitle ?? defaultSubtitle;
  const showBack = pageHeader?.showBack ?? currentHeader.showBack;
  const backTo = pageHeader?.backTo ?? currentHeader.backTo;

  return (
    <div className="flex">
      <Sidebar
        links={navigation[userRole]}
        role={currentUser.role}
        userName={currentUser.name}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-24" : "ml-60"
        }`}
      >
        <div className="px-6 pt-3">
          <Header
            title={headerTitle}
            subtitle={headerSubtitle}
            userRole={userRole}
            showBack={showBack}
            onBackClick={() => {
              if (pageHeader?.onBackClick) {
                pageHeader.onBackClick();
              } else {
                navigate(backTo || -1);
              }
            }}
          />
        </div>

        <div className="px-6 py-2">
          <Outlet context={{ setPageHeader }} />
        </div>
      </div>
    </div>
  );
}
