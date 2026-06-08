import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { addEmployeeToTemporaryDatabase, getStoredDepartments } from '../../../common/utils/mockAuth.js';

const PAGE_SIZE_OPTIONS = [10, 15, 20];
const AVATAR_COLORS = [
  'bg-amber-100 text-amber-700',
  'bg-cyan-100 text-cyan-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
];
const TYPE_SEQUENCE = ['Office', 'Remote'];
const EMPTY_EMPLOYEE_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dob: '',
  maritalStatus: '',
  gender: '',
  nationality: '',
  address: '',
  city: '',
  zipCode: '',
  type: 'Office',
  status: 'Permanent',
};
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Widowed', 'Separated'];
const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const TYPE_OPTIONS = ['Office', 'Remote'];
const STATUS_OPTIONS = ['Permanent', 'Probationary', 'Contractual'];
const ADD_EMPLOYEE_TABS = {
  MANUAL: 'manual',
  BULK: 'bulk',
};
const EMPLOYEE_TEXT_FIELDS = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'phone', label: 'Mobile Number', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'dob', label: 'Date of Birth', type: 'date' },
  { name: 'nationality', label: 'Nationality' },
  { name: 'address', label: 'Address', wide: true },
  { name: 'city', label: 'City' },
  { name: 'zipCode', label: 'ZIP Code' },
];

export default function StaffManagement() {
  const [departments, setDepartments] = useState(() => getStoredDepartments());
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState(ADD_EMPLOYEE_TABS.MANUAL);
  const [employeeForm, setEmployeeForm] = useState(EMPTY_EMPLOYEE_FORM);
  const [formError, setFormError] = useState('');

  // Add Department State
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptTitle, setNewDeptTitle] = useState('');

  // Filter Dropdown States
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const activeDepartment = useMemo(
    () => departments.find((department) => department.title === selectedDepartment) ?? null,
    [departments, selectedDepartment],
  );

  const employeeRows = useMemo(() => {
    if (!activeDepartment) {
      return [];
    }

    return activeDepartment.members.map((member, index) => ({
      id:
        member.id?.replace(/^employee_/, '') ||
        `${(index + 1).toString().padStart(3, '0')}${String(member.name.length).padStart(3, '0')}${String(
          activeDepartment.title.length,
        ).padStart(3, '0')}`,
      name: member.name,
      type: member.type || TYPE_SEQUENCE[index % TYPE_SEQUENCE.length],
      status: member.status || 'Permanent',
      initials: member.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      avatarClass: AVATAR_COLORS[index % AVATAR_COLORS.length],
    }));
  }, [activeDepartment]);

  const filteredEmployees = useMemo(() => {
    let list = employeeRows;

    // Apply type filter
    if (filterType !== 'All') {
      list = list.filter((e) => e.type === filterType);
    }

    // Apply status filter
    if (filterStatus !== 'All') {
      list = list.filter((e) => e.status === filterStatus);
    }

    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return list;
    }

    return list.filter((employee) =>
      [employee.id, employee.name, employee.type, employee.status]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [employeeRows, searchTerm, filterType, filterStatus]);

  const filteredDepartments = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return departments;
    }
    return departments.filter(
      (dept) =>
        dept.title.toLowerCase().includes(normalized) ||
        dept.members.some((member) => member.name.toLowerCase().includes(normalized))
    );
  }, [departments, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEmployees = filteredEmployees.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleViewAll = (departmentTitle) => {
    setSelectedDepartment(departmentTitle);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleOpenAddEmployee = () => {
    setEmployeeForm(EMPTY_EMPLOYEE_FORM);
    setActiveAddTab(ADD_EMPLOYEE_TABS.MANUAL);
    setFormError('');
    setIsAddEmployeeOpen(true);
  };

  const handleCloseAddEmployee = () => {
    setIsAddEmployeeOpen(false);
  };

  const handleEmployeeFormChange = (event) => {
    const { name, value } = event.target;
    setEmployeeForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAddEmployee = (event) => {
    event.preventDefault();

    if (!activeDepartment) {
      return;
    }

    const requiredFields = ['firstName', 'lastName', 'phone', 'email'];
    const hasMissingRequiredField = requiredFields.some((field) => !employeeForm[field].trim());

    if (hasMissingRequiredField) {
      setFormError('Please complete the required employee information.');
      return;
    }

    const { departments: nextDepartments } = addEmployeeToTemporaryDatabase(activeDepartment.title, employeeForm);
    const activeMemberCount =
      nextDepartments.find((department) => department.title === activeDepartment.title)?.members.length || 0;

    setDepartments(nextDepartments);
    setSearchTerm('');
    setCurrentPage(Math.max(1, Math.ceil(activeMemberCount / pageSize)));
    setEmployeeForm(EMPTY_EMPLOYEE_FORM);
    setFormError('');
    setIsAddEmployeeOpen(false);
  };

  const handleAddDepartmentSubmit = (event) => {
    event.preventDefault();
    if (!newDeptTitle.trim()) return;

    const exists = departments.some(
      (dept) => dept.title.toLowerCase() === newDeptTitle.trim().toLowerCase()
    );
    if (exists) {
      alert("A department with this name already exists.");
      return;
    }

    const newDept = {
      title: newDeptTitle.trim(),
      count: 0,
      members: [],
    };

    const nextDepartments = [...departments, newDept];
    setDepartments(nextDepartments);
    localStorage.setItem("hrims_departments_db", JSON.stringify(nextDepartments));
    setNewDeptTitle('');
    setIsAddDeptOpen(false);
  };

  return (
    <div className="space-y-6">
      {!activeDepartment ? (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
                >
                  <Plus size={16} />
                  Add New Department
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {filteredDepartments.map((department) => (
              <div key={department.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{department.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{department.count} Members</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewAll(department.title)}
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {department.members.map((member) => (
                    <div key={member.name} className="rounded-3xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBackToDepartments}
                className="inline-flex items-center justify-center rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Back to departments"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-slate-900">{activeDepartment.title}</h1>
            </div>
            <p className="text-sm text-slate-500">Staff Management &gt; {activeDepartment.title}</p>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-[220px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenAddEmployee}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Add New Employee
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition hover:bg-slate-50 cursor-pointer ${
                      filterType !== 'All' || filterStatus !== 'All'
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Filter size={16} />
                    Filter {(filterType !== 'All' || filterStatus !== 'All') && "•"}
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Employee Type</label>
                          <select
                            value={filterType}
                            onChange={(e) => {
                              setFilterType(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none"
                          >
                            <option value="All">All Types</option>
                            <option value="Office">Office</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                          <select
                            value={filterStatus}
                            onChange={(e) => {
                              setFilterStatus(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none"
                          >
                            <option value="All">All Statuses</option>
                            <option value="Permanent">Permanent</option>
                            <option value="Probationary">Probationary</option>
                            <option value="Contractual">Contractual</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setFilterType('All');
                              setFilterStatus('All');
                              setIsFilterDropdownOpen(false);
                              setCurrentPage(1);
                            }}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-0">
                <thead>
                  <tr className="text-left text-sm text-slate-400">
                    <th className="border-b border-slate-100 px-3 py-3 font-medium">Employee ID</th>
                    <th className="border-b border-slate-100 px-3 py-3 font-medium">Employee Name</th>
                    <th className="border-b border-slate-100 px-3 py-3 font-medium">Type</th>
                    <th className="border-b border-slate-100 px-3 py-3 font-medium">Status</th>
                    <th className="border-b border-slate-100 px-3 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} className="text-sm text-slate-700">
                      <td className="border-b border-slate-100 px-3 py-3">{employee.id}</td>
                      <td className="border-b border-slate-100 px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${employee.avatarClass}`}>
                            {employee.initials}
                          </div>
                          <span className="font-medium text-slate-800">{employee.name}</span>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-3 py-3">{employee.type}</td>
                      <td className="border-b border-slate-100 px-3 py-3">
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-500">
                          {employee.status}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-3 py-3">
                        <div className="flex items-center justify-center gap-3 text-slate-500">
                          <button type="button" className="transition hover:text-slate-800" aria-label={`View ${employee.name}`}>
                            <Eye size={16} />
                          </button>
                          <button type="button" className="transition hover:text-slate-800" aria-label={`Edit ${employee.name}`}>
                            <Pencil size={16} />
                          </button>
                          <button type="button" className="transition hover:text-rose-500" aria-label={`Delete ${employee.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span>Showing</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <p>
                Showing {filteredEmployees.length === 0 ? 0 : (safePage - 1) * pageSize + 1} to{' '}
                {Math.min(safePage * pageSize, filteredEmployees.length)} out of {filteredEmployees.length} records
              </p>

              <div className="flex items-center gap-2 text-slate-600">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safePage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === safePage;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${
                        isActive
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {isAddEmployeeOpen && activeDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Add New Employee</h2>
              </div>
              <button
                type="button"
                onClick={handleCloseAddEmployee}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close add employee form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveAddTab(ADD_EMPLOYEE_TABS.MANUAL)}
                className={`border-b-2 pb-2 text-sm font-semibold transition ${
                  activeAddTab === ADD_EMPLOYEE_TABS.MANUAL
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-300 hover:text-slate-500'
                }`}
              >
                Add New Employee
              </button>
              <button
                type="button"
                onClick={() => setActiveAddTab(ADD_EMPLOYEE_TABS.BULK)}
                className={`border-b-2 pb-2 text-sm font-semibold transition ${
                  activeAddTab === ADD_EMPLOYEE_TABS.BULK
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-300 hover:text-slate-500'
                }`}
              >
                Bulk Upload
              </button>
            </div>

            {activeAddTab === ADD_EMPLOYEE_TABS.MANUAL ? (
              <form onSubmit={handleAddEmployee} className="mt-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {EMPLOYEE_TEXT_FIELDS.map((field) => (
                    <label key={field.name} className={field.wide ? 'md:col-span-2' : ''}>
                      <span className="mb-1 block text-xs font-medium text-slate-500">
                        {field.label}
                        {field.required ? ' *' : ''}
                      </span>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={employeeForm[field.name]}
                        onChange={handleEmployeeFormChange}
                        required={field.required}
                        placeholder={field.type === 'date' ? undefined : field.label}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  ))}

                  <label>
                    <span className="mb-1 block text-xs font-medium text-slate-500">Marital Status</span>
                    <select
                      name="maritalStatus"
                      value={employeeForm.maritalStatus}
                      onChange={handleEmployeeFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">Select marital status</option>
                      {MARITAL_STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-slate-500">Gender</span>
                    <select
                      name="gender"
                      value={employeeForm.gender}
                      onChange={handleEmployeeFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-slate-500">Type</span>
                    <select
                      name="type"
                      value={employeeForm.type}
                      onChange={handleEmployeeFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-slate-500">Status</span>
                    <select
                      name="status"
                      value={employeeForm.status}
                      onChange={handleEmployeeFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {formError && <p className="mt-4 text-sm font-medium text-rose-500">{formError}</p>}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseAddEmployee}
                    className="inline-flex h-11 min-w-28 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-11 min-w-36 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5">
                <p className="text-xs font-medium text-slate-900">Required Information</p>
                <div className="mt-3 h-32 rounded-xl bg-slate-100 md:h-40" />

                <p className="mt-5 text-xs font-medium text-slate-900">Download Template here</p>
                <div className="mt-3 h-14 rounded-xl bg-slate-100 md:h-16" />

                <div className="mt-5 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-950 px-4 py-6 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Upload size={17} />
                  </span>
                  <p className="mt-3 text-sm text-slate-900">Drag & Drop or choose file to upload</p>
                  <p className="mt-1 text-xs text-slate-300">Supported formats : Jpeg, pdf</p>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseAddEmployee}
                    className="inline-flex h-11 min-w-28 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-11 min-w-36 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Add Employee
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-semibold text-slate-900">Add New Department</h2>
              <button
                type="button"
                onClick={() => setIsAddDeptOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddDepartmentSubmit} className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Department Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering"
                  value={newDeptTitle}
                  onChange={(e) => setNewDeptTitle(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 min-w-28 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Add Dept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
