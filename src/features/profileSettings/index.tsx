import React, { useState } from 'react';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import Button from '../../components/Button';
import FileUploader from '../../components/FileUploader';
import { useTheme } from '../../context/themeContext';

const AccountManagement: React.FC = () => {
    const [formData, setFormData] = useState({
        username: 'gene.rodrig',
        firstName: 'Gene',
        nickname: 'Gene.r',
        role: 'Subscriber',
        lastName: 'Rodriguez',
        displayName: 'Gene',
        email: 'gene.rodrig@gmail.com',
        whatsapp: '@gene-rod',
        website: 'gene-roding.webflow.io',
        telegram: '@gene-rod',
        oldPassword: '******',
        newPassword: '******',
        bio: 'Albert Einstein was a German mathematician and physicist who developed the special and general theories of relativity. In 1921, he won the Nobel Prize for physics for his explanation of the photoelectric effect. In the following decade.',
    });

    const [profileImageKey, setProfileImageKey] = useState<string>('');
    const [isUploadingAny, setIsUploadingAny] = useState(false);
    const { isDarkMode } = useTheme();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileImageChange = (key: string, fileName?: string) => {
        setProfileImageKey(key);
        console.log('Profile image uploaded:', { key, fileName });
    };

    const handleChangePassword = () => {

    };

    return (
        <>
            <div className={`${isDarkMode ? "bg-slate-900" : "bg-white"} flex  rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto`}>
                <div className="w-1/3 p-6 border-r border-gray-200 flex flex-col gap-6">
                    <h2 className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-semibold`}>Account Management</h2>

                    <FileUploader
                        value={profileImageKey}
                        onChange={handleProfileImageChange}
                        type="image"
                        path="users-documents"
                        initialPreview="https://images.unsplash.com/photo-1548142813-c3483ebb7c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                        size={4}
                        fit="cover"
                        isUploadingAny={isUploadingAny}
                        setIsUploadingAny={setIsUploadingAny}
                    />


                    <div className="space-y-4">
                        <div>
                            <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Old Password</label>
                            <InputField
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>New Password</label>
                            <InputField
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Button
                            onClick={handleChangePassword}
                            className="w-full"
                            disabled={isUploadingAny}
                        >
                            {isUploadingAny ? 'Uploading...' : 'Change Password'}
                        </Button>
                    </div>
                </div>


                <div className="w-2/3 p-6 space-y-6">

                    <div>
                        <h3 className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-semibold mb-4`}>Profile Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Username</label>
                                <InputField
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>First Name</label>
                                <InputField
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Nickname</label>
                                <InputField
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`} >Role</label>
                                <SelectField
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    options={[
                                        { value: "Subscriber", label: "Subscriber" },
                                        { value: "Editor", label: "Editor" },
                                        { value: "Admin", label: "Admin" }
                                    ]}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Last Name</label>
                                <InputField
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Display Name Publicly as</label>
                                <InputField
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        <h3 className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-semibold mb-4`}>Contact Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Email (required)</label>
                                <InputField
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>WhatsApp</label>
                                <InputField
                                    type="text"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Website</label>
                                <InputField
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Telegram</label>
                                <InputField
                                    type="text"
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        <h3 className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-semibold mb-4`}>About the User</h3>
                        <div>
                            <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} block text-sm font-medium mb-1`}>Biographical Info</label>
                            <InputField
                                name="bio"
                                type="textarea"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="Write your bio..."
                            />
                        </div>
                    </div>


                    {/* <div className="flex justify-end pt-4">
                    <Button
                        className="px-6 py-2"
                        disabled={isUploadingAny}
                    >
                        {isUploadingAny ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div> */}
                </div>
            </div>
        </>
    );
};

export default AccountManagement;