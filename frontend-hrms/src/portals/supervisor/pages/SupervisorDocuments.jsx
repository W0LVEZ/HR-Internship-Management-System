import { Download, Eye } from 'lucide-react';
import { useState } from 'react';
import DocumentsViewModal from "../components/ui/DocumentsViewModal";

export default function SupervisorDocuments() {
  const [openPreview, setOpenPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  
  const documentsAllData = [
    {
      internName : "Cara Lim",
      internProfile : "../../../public/image.png",
      requestedDate : "02-12-2026",
      documentType : "Weekly AR",
      dueDate : "05-22-2026",
      requestedStatus : "Approved",
      fileIcon : <svg width="15" height="15" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15.25C19.8968 15.25 20.8938 16.0344 20.6035 17.1748C20.0804 19.2295 18.2187 20.75 16 20.75H4V19.25C5.51631 19.25 6.79146 18.2107 7.14941 16.8047C7.34171 16.0495 8.00116 15.25 9 15.25H19ZM13 0C14.6569 0 16 1.34315 16 3V14.5H7.2998C6.85813 14.5001 6.50011 14.8581 6.5 15.2998C6.5 17.067 5.04261 18.4999 3.27539 18.5C1.48047 18.5 0 17.0449 0 15.25V3C0 1.34315 1.34315 0 3 0H13ZM4 9.25C3.58579 9.25 3.25 9.58579 3.25 10C3.25 10.4142 3.58579 10.75 4 10.75H8C8.41421 10.75 8.75 10.4142 8.75 10C8.75 9.58579 8.41421 9.25 8 9.25H4ZM4 4.25C3.58579 4.25 3.25 4.58579 3.25 5C3.25 5.41421 3.58579 5.75 4 5.75H12C12.4142 5.75 12.75 5.41421 12.75 5C12.75 4.58579 12.4142 4.25 12 4.25H4Z" fill="#7C3EFF"/>
                  </svg>,
      fileName : "Weekly AR",
      fileSize : "1.5 MB"
    },
    {
      internName : "Ana Reyes",
      internProfile : "../../../public/image.png",
      requestedDate : "02-13-2026",
      documentType : "Certificate of Completion",
      dueDate : "05-22-2026",
      requestedStatus : "Pending",
      fileIcon : <svg width="15" height="15" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15.25C19.8968 15.25 20.8938 16.0344 20.6035 17.1748C20.0804 19.2295 18.2187 20.75 16 20.75H4V19.25C5.51631 19.25 6.79146 18.2107 7.14941 16.8047C7.34171 16.0495 8.00116 15.25 9 15.25H19ZM13 0C14.6569 0 16 1.34315 16 3V14.5H7.2998C6.85813 14.5001 6.50011 14.8581 6.5 15.2998C6.5 17.067 5.04261 18.4999 3.27539 18.5C1.48047 18.5 0 17.0449 0 15.25V3C0 1.34315 1.34315 0 3 0H13ZM4 9.25C3.58579 9.25 3.25 9.58579 3.25 10C3.25 10.4142 3.58579 10.75 4 10.75H8C8.41421 10.75 8.75 10.4142 8.75 10C8.75 9.58579 8.41421 9.25 8 9.25H4ZM4 4.25C3.58579 4.25 3.25 4.58579 3.25 5C3.25 5.41421 3.58579 5.75 4 5.75H12C12.4142 5.75 12.75 5.41421 12.75 5C12.75 4.58579 12.4142 4.25 12 4.25H4Z" fill="#7C3EFF"/>
                  </svg>,
      fileName : "COC",
      fileSize : "2.5 MB"
    },
    {
      internName : "Carlos Garcia",
      internProfile : "../../../public/image.png",
      requestedDate : "02-13-2026",
      documentType : "Evaluation Form",
      dueDate : "05-22-2026",
      requestedStatus : "Approved",
      fileIcon : <svg width="15" height="15" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15.25C19.8968 15.25 20.8938 16.0344 20.6035 17.1748C20.0804 19.2295 18.2187 20.75 16 20.75H4V19.25C5.51631 19.25 6.79146 18.2107 7.14941 16.8047C7.34171 16.0495 8.00116 15.25 9 15.25H19ZM13 0C14.6569 0 16 1.34315 16 3V14.5H7.2998C6.85813 14.5001 6.50011 14.8581 6.5 15.2998C6.5 17.067 5.04261 18.4999 3.27539 18.5C1.48047 18.5 0 17.0449 0 15.25V3C0 1.34315 1.34315 0 3 0H13ZM4 9.25C3.58579 9.25 3.25 9.58579 3.25 10C3.25 10.4142 3.58579 10.75 4 10.75H8C8.41421 10.75 8.75 10.4142 8.75 10C8.75 9.58579 8.41421 9.25 8 9.25H4ZM4 4.25C3.58579 4.25 3.25 4.58579 3.25 5C3.25 5.41421 3.58579 5.75 4 5.75H12C12.4142 5.75 12.75 5.41421 12.75 5C12.75 4.58579 12.4142 4.25 12 4.25H4Z" fill="#7C3EFF"/>
                  </svg>,
      fileName : "Evaluation",
      fileSize : "1.6 MB"
    },
  ]
  return (
    <>
    <div className="border border-gray-300 rounded-lg p-5">

      <div className="flex justify-between items-center">
          <div className="search-bar">
            <input type="search" name="search" id="" placeholder="Search interns..." className="border border-gray-500/20 rounded-lg py-2 px-3 w-70 focus:outline-none focus:ring-2 focus:ring-[#7C3EFF]" />
          </div>
          <div className="filter-options flex items-center space-x-4">  
            <select id="" className="border border-gray-500/20 w-23 rounded-lg ms-3 py-2 px-3 focus:outline-none hover:border-gray-500/40 cursor-pointer">
              <option disabled selected>Filter</option>
              <option value="2023-10-01">by Intern Name</option>
              <option value="2023-10-02">by File Name</option>
              <option value="2023-10-03">by Requested</option>
              <option value="2023-10-03">by Requested Status</option>
            </select>
          </div>
        </div>

        <div className="mt-2 border rounded-lg border-gray-300 p-2">
          <table className="table-fixed w-full">
            <thead className="text-sm text-gray-500">
              <tr className="border-b border-gray-200">
                <td className="p-2">Intern Name</td>
                <td className="p-2">File Name</td>
                <td className="p-2">Requested</td>
                <td className="p-2">Document Type</td>
                <td className="p-2">Due Date</td>
                <td className="p-2">Requested Status</td>
                <td className="p-2">Actions</td>
              </tr>
            </thead>
            <tbody className="text-sm">
              {documentsAllData.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className="py-2 flex justify-start items-center gap-2">
                    <img src={data.internProfile} className="bg-violet-500 size-8 rounded-full" />
                    <h1>{data.internName}</h1>
                  </div>
                </td>
                <td>
                  <div className="py-2 flex justify-start items-center gap-2">
                    {data.fileIcon}
                    <div className="flex flex-col gap-0">
                      <p className="font-semibold">{data.fileName}</p>
                      <span className="text-gray-400 text-xs">{data.fileSize}</span>
                    </div>
                  </div>
                </td>
                <td><h1>{data.requestedDate}</h1></td>
                <td><p className="text-sm text-gray-700">{data.documentType}</p></td>
                <td><p className="text-sm text-gray-500">{data.dueDate}</p></td>
                <td className="text-xs">
                  {data.requestedStatus === "Approved" ? (
                  <div className="bg-green-200 text-green-500 inline-block p-1 rounded-lg">
                    <span>{data.requestedStatus}</span>
                  </div>) : data.requestedStatus === "Pending" ? (
                    <div className="bg-yellow-200/70 text-yellow-400 inline-block p-1 rounded-lg">
                      <span>{data.requestedStatus}</span>
                    </div>) : (
                      <div className="bg-red-100 text-red-500 inline-block p-1 rounded-lg">
                        <span>{data.requestedStatus}</span>
                      </div>
                    )}
                </td>
                <td>
                  <div className="flex justify-start gap-5 items-center transition">
                    <Eye
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewDocument(data);
                        setOpenPreview(true);
                      }}
                      className="cursor-pointer hover:text-violet-500 transition"
                    />
                    <button className="cursor-pointer hover:text-violet-500 duration-200"><Download /></button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <DocumentsViewModal
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
        document={previewDocument}
      />
    </div>
    
    </>
  )
}