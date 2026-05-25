import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react"; // Icons for the search and filter
import EvaluationCard from "../components/ui/evaluations/EvaluationCard";
import EvaluationModal from "../components/ui/evaluations/EvaluationModal";
import { useAuth } from "../../../contexts/AuthContext";
import { addSystemLog, LOG_TYPES } from "../../../common/utils/systemLogger";

export default function SupervisorEvaluations() {
  const { currentUser } = useAuth();
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);

  // New States for Search and Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All, Completed, Pending

  useEffect(() => {
    const loadInternData = () => {
      const usersDb = JSON.parse(
        localStorage.getItem("hrims_users_db") || "{}",
      );
      const allInterns = Object.values(usersDb).filter(
        (user) =>
          user.role === "INTERN" && user.supervisorId === currentUser?.id,
      );
      const evalsDb = JSON.parse(
        localStorage.getItem("hrims_evaluations_db") || "[]",
      );

      const updatedInterns = allInterns.map((intern) => {
        const internHistory = evalsDb.filter(
          (evalRecord) => evalRecord.internId === intern.id,
        );
        return {
          ...intern,
          evaluationHistory: internHistory,
          evalCount: internHistory.length,
        };
      });
      setInterns(updatedInterns);
    };
    loadInternData();
  }, [currentUser?.id]);

  const handleEvaluationSubmit = (newEvaluationData) => {
    if (!selectedIntern) return;
    const existingHistory = JSON.parse(
      localStorage.getItem("hrims_evaluations_db") || "[]",
    );
    const newRecord = {
      ...newEvaluationData,
      supervisorId: currentUser?.id || "unknown",
      supervisorName: currentUser?.name || "Supervisor",
      internId: selectedIntern.id,
    };
    const updatedHistory = [...existingHistory, newRecord];
    localStorage.setItem(
      "hrims_evaluations_db",
      JSON.stringify(updatedHistory),
    );
    addSystemLog({
      action: LOG_TYPES.EVALUATION_COMPLETED,
      title: "Evaluation Completed",
      description: `${currentUser?.name || "Supervisor"} completed an evaluation for ${selectedIntern.name}.`,
      actorId: currentUser?.id,
      actorName: currentUser?.name,
      actorRole: currentUser?.role,
      audience: ["hr-admin", "supervisor", "intern"],
      supervisorId: currentUser?.id,
      internId: selectedIntern.id,
      metadata: {
        evaluationId: newRecord.id,
      },
    });

    setInterns((prevInterns) =>
      prevInterns.map((i) => {
        if (i.id === selectedIntern.id) {
          const updatedInternHistory = [
            ...(i.evaluationHistory || []),
            newRecord,
          ];
          return {
            ...i,
            evaluationHistory: updatedInternHistory,
            evalCount: updatedInternHistory.length,
          };
        }
        return i;
      }),
    );
    setSelectedIntern(null);
  };

  // --- Search & Filter Logic ---
  const filteredInterns = interns.filter((intern) => {
    const matchesSearch = intern.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isCompleted = intern.evalCount > 0;

    if (filterStatus === "Completed") return matchesSearch && isCompleted;
    if (filterStatus === "Pending") return matchesSearch && !isCompleted;
    return matchesSearch; // Default for "All"
  });

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-h-screen font-sans">
      {/* Search and Filter Bar */}
      <div className="bg-white px-0 py-4 mb-4 flex flex-wrap gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search interns..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Interns</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* The Grid */}
      {filteredInterns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterns.map((intern) => (
            <EvaluationCard
              key={intern.id}
              intern={intern}
              onEvaluateClick={() => setSelectedIntern(intern)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">
            No interns found matching your criteria.
          </p>
        </div>
      )}

      {/* The Modal */}
      {selectedIntern && (
        <EvaluationModal
          intern={selectedIntern}
          onClose={() => setSelectedIntern(null)}
          onSubmit={handleEvaluationSubmit}
        />
      )}
    </div>
  );
}
