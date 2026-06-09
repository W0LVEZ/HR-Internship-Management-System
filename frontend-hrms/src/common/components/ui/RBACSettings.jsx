import { useState } from "react";
import { toast } from "sonner";
import ToggleSwitch from "../ui/ToggleSwitch"; 

export default function RBACSettings() {
    const modules = ["Attendance", "Intern Records", "Settings", "Reports"];
    const actions = ["View", "Create", "Edit", "Delete"];

    const defaultPermissions = {
        "hr-staff": {
            Attendance: { View: true, Create: true, Edit: true, Delete: false },
            "Intern Records": { View: true, Create: true, Edit: true, Delete: false },
            Settings: { View: true, Create: false, Edit: false, Delete: false },
            Reports: { View: true, Create: true, Edit: true, Delete: false },
        },
        "supervisor": {
            Attendance: { View: true, Create: true, Edit: true, Delete: false },
            "Intern Records": { View: true, Create: false, Edit: false, Delete: false },
            Settings: { View: true, Create: false, Edit: false, Delete: false },
            Reports: { View: true, Create: false, Edit: false, Delete: false },
        },
        "intern": {
            Attendance: { View: true, Create: false, Edit: false, Delete: false },
            "Intern Records": { View: false, Create: false, Edit: false, Delete: false },
            Settings: { View: true, Create: false, Edit: false, Delete: false },
            Reports: { View: false, Create: false, Edit: false, Delete: false },
        },
    };

    const [selectedRole, setSelectedRole] = useState("hr-staff");

    // Initialize permissions for the default selected role
    const [permissions, setPermissions] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("hrims_rbac_permissions") || "{}");
        return stored["hr-staff"] || defaultPermissions["hr-staff"];
    });

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        const stored = JSON.parse(localStorage.getItem("hrims_rbac_permissions") || "{}");
        const rolePerms = stored[role] || defaultPermissions[role] || {
            Attendance: { View: false, Create: false, Edit: false, Delete: false },
            "Intern Records": { View: false, Create: false, Edit: false, Delete: false },
            Settings: { View: false, Create: false, Edit: false, Delete: false },
            Reports: { View: false, Create: false, Edit: false, Delete: false },
        };
        setPermissions(rolePerms);
    };

    const handleToggle = (module, action) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [action]: !prev[module][action]
            }
        }));
    };

    const handleSave = () => {
        if (!selectedRole) {
            toast.error("Please select a role first.");
            return;
        }
        const allSavedPerms = JSON.parse(localStorage.getItem("hrims_rbac_permissions") || "{}");
        allSavedPerms[selectedRole] = permissions;
        localStorage.setItem("hrims_rbac_permissions", JSON.stringify(allSavedPerms));
        
        const roleName = selectedRole === "hr-staff" ? "HR Staff" : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        toast.success(`Permissions for ${roleName} saved successfully!`);
    };

    return (
        <div className="pt-4 font-lexend">
            <div className="border border-[#A2A1A833] rounded-xl p-6 bg-white shadow-sm">
                
                <h3 className="text-base font-bold text-gray-900 mb-1">Roles and Permission Management</h3>
                <p className="text-sm text-gray-400 mb-6">Control user permissions</p>
                
                <select 
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full border border-[#A2A1A833] rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[#7C3EFF] focus:ring-1 focus:ring-[#7C3EFF] transition-colors appearance-none bg-white cursor-pointer"
                >
                    <option value="" disabled>Role</option>
                    <option value="hr-staff">HR Staff</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="intern">Intern</option>
                </select>

                <div className="mt-8 overflow-x-auto">
                    <div className="min-w-150px"> 
                        
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            <div className="col-span-1"></div> 
                            {actions.map(action => (
                                <div key={action} className="text-center font-bold text-gray-900 text-sm">
                                    {action}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-6">
                            {modules.map(module => (
                                <div key={module} className="grid grid-cols-5 gap-4 items-center">
                                
                                    <div className="font-bold text-gray-900 text-sm">
                                        {module}
                                    </div>
                                    
                                    {actions.map(action => (
                                        <div key={`${module}-${action}`} className="flex justify-center">
                                            <ToggleSwitch 
                                                checked={permissions[module]?.[action] ?? false}
                                                onChange={() => handleToggle(module, action)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!selectedRole}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}