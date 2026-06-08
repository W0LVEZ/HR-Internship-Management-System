import { BriefcaseBusiness, Mail, PenLine, CornerDownLeft } from "lucide-react";
import { useRef, useState } from "react";

export default function ProfileHeader({
  user,
  mode,
  activeTab,
  isEditing,
  onEditClick,
  onBackClick,
  hideAction,
}) {
  const isIntern = mode === "INTERN";
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleProfileClick = () => {
  fileInputRef.current?.click();
};

const handleProfileChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setSelectedFile(file);

  const previewUrl = URL.createObjectURL(file);
  setProfileImage(previewUrl);
};

console.log(profileImage);

  return (
    <div className="flex justify-between items-center pb-5  ">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Changeable profile picture */}
        <div
          onClick={isEditing ? handleProfileClick : undefined}
          className={`relative w-20 h-20 rounded-md overflow-hidden transition ${
            isEditing 
              ? "bg-gray-400 cursor-pointer hover:bg-gray-500 ring-2 ring-violet-400"
              : "bg-gray-400"
          }`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-xs text-white text-center">
                Change Photo
              </span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfileChange}
        />

        <div>
          <h2 className="font-bold text-xl">{user.name}</h2>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <BriefcaseBusiness size={14} />
            {user.role}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <Mail size={14} />
            {user.email}
          </p>
        </div>
      </div>

      {/* This is only for intern and when the personal tab is active */}
      {!hideAction && (
        <>
          {isIntern && activeTab === "personal" ? (
            <button
              onClick={onEditClick}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:text-purple-500 hover:bg-primary-hover transition"
            >
              <PenLine size={14} />
              {isEditing ? "Save changes" : "Edit Profile"}
            </button>
          ) : (
            <button
              onClick={onBackClick}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white font-semibold border border-gray-200 rounded-lg hover:bg-primary-hover transition"
            >
              <CornerDownLeft size={16} />
              Return
            </button>
          )}
        </>
      )}
    </div>
  );
}
