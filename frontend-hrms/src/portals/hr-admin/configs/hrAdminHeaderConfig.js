export const hrAdminHeaderConfig = {
  "/hr-admin": {
    title: "Dashboard",
    subtitle: "",
  },
  "/hr-admin/recruitment": {
    title: "Recruitment",
    subtitle: "All Talent Acquisition",
  },
  "/hr-admin/intern-management": {
    title: "Intern Management",
    subtitle: "Daily Workflow & Tracking",
  },
  "/hr-admin/staff-management": {
    title: "Staff Management",
    subtitle: "Permission & Acces Control",
  },
  "/hr-admin/document-vault": {
    title: "Document Vault",
    subtitle: "Compliance & Record Keeping",
  },
  "/hr-admin/document-vault/:folderId": {
    getTitle: ({ params }) =>
      ({
        moa: "MOA",
        nda: "NDA",
        "endorsement-letter": "Endorsement Letter",
      }[params.folderId] ?? "Document Vault"),
    getSubtitle: ({ params }) =>
      `Document Vault · ${
        {
          moa: "MOA",
          nda: "NDA",
          "endorsement-letter": "Endorsement Letter",
        }[params.folderId] ?? "Selected folder"
      }`,
  },
  "/hr-admin/reports-and-analytics": {
    title: "Reports & Analytics",
    subtitle: "Performance Tracking",
  },
  "/hr-admin/system-logs": {
    title: "System Logs",
    subtitle: "User Activity Logs",
  },
  "/hr-admin/settings": {
    title: "Settings",
    subtitle: "All system settings",
  },
};
