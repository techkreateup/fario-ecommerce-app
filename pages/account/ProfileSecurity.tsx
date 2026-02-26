import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
import { ChevronRight, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

const { Link, useNavigate } = RouterDOM as any;

const ProfileSecurity: React.FC = () => {
    const navigate = useNavigate();
    // Initialize with safe defaults, never assume data exists
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('fario_user_profile');
            return stored ? JSON.parse(stored) : { name: 'Guest User', email: 'guest@fario.in', mobile: '9876543210' };
        } catch (e) {
            return { name: 'Guest User', email: 'guest@fario.in', mobile: '' };
        }
    });

    const [editMode, setEditMode] = useState<'NONE' | 'NAME' | 'MOBILE' | 'PASSWORD'>('NONE');
    const [tempData, setTempData] = useState({ name: '', mobile: '', currentPass: '', newPass: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [success]);

    const startEdit = (field: 'NAME' | 'MOBILE' | 'PASSWORD') => {
        setEditMode(field);
        setTempData({ name: user.name, mobile: user.mobile, currentPass: '', newPass: '' });
        setError(null);
    };

    const cancelEdit = () => {
        setEditMode('NONE');
        setError(null);
    };

    const saveField = () => {
        setError(null);
        let updated = { ...user };

        if (editMode === 'NAME') {
            if (!tempData.name.trim()) return setError('Name cannot be empty.');
            updated.name = tempData.name;
        }
        else if (editMode === 'MOBILE') {
            if (!/^\d{10}$/.test(tempData.mobile)) return setError('Mobile number must be 10 digits.');
            updated.mobile = tempData.mobile;
        }
        else if (editMode === 'PASSWORD') {
            if (!tempData.currentPass || !tempData.newPass) return setError('All fields are required.');
            if (tempData.newPass.length < 6) return setError('Password must be at least 6 characters.');
            // Mock password update
            setSuccess('Password updated successfully.');
            setEditMode('NONE');
            return;
        }

        setUser(updated);
        localStorage.setItem('fario_user_profile', JSON.stringify(updated));
        setSuccess(`Successfully updated ${editMode.toLowerCase()}.`);
        setEditMode('NONE');
    };

    return (
        <div className="min-h-screen bg-white pb-20 pt-28 px-4 font-sans text-[#0F1111]">
            <div className="max-w-3xl mx-auto">

                <div className="flex items-center text-sm text-[#565959] mb-4">
                    <Link to="/profile" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <ChevronRight size={14} className="mx-1" />
                    <span className="text-[#C7511F]">Login & Security</span>
                </div>

                <h1 className="text-[28px] font-normal mb-2">Login & Security</h1>

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-800">
                        <Check size={16} /> {success}
                    </div>
                )}

                <div className="border border-[#D5D9D9] rounded-lg divide-y divide-[#D5D9D9]">

                    {/* NAME */}
                    <div className="p-6 flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold mb-1">Name</h3>
                            {editMode === 'NAME' ? (
                                <div className="max-w-sm mt-3">
                                    <label className="block text-xs font-bold mb-1">New name</label>
                                    <input
                                        value={tempData.name}
                                        onChange={e => setTempData({ ...tempData, name: e.target.value })}
                                        className="w-full border border-[#888C8C] rounded-[4px] py-1.5 px-3 mb-1 focus:ring-1 focus:ring-teal-600 focus:outline-none focus:border-teal-600"
                                    />
                                    {error && <p className="text-xs text-red-600 flex items-center gap-1 mb-2"><AlertCircle size={10} /> {error}</p>}
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={saveField} className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-[8px] text-sm shadow-sm hover:bg-[#F7CA00]">Save changes</button>
                                        <button onClick={cancelEdit} className="text-sm hover:underline px-2">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[14px]">{user.name}</p>
                            )}
                        </div>
                        {editMode !== 'NAME' && (
                            <button onClick={() => startEdit('NAME')} className="bg-white border border-[#D5D9D9] px-6 py-1.5 rounded-[8px] text-sm shadow-sm hover:bg-[#F7FAFA]">Edit</button>
                        )}
                    </div>

                    {/* EMAIL (READ ONLY) */}
                    <div className="p-6 flex justify-between items-center group">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold mb-1">Email</h3>
                            <p className="text-[14px]">{user.email}</p>
                        </div>
                        <div className="relative">
                            <button disabled className="bg-white border border-[#D5D9D9] px-6 py-1.5 rounded-[8px] text-sm shadow-sm opacity-50 cursor-not-allowed text-[#565959]">Edit</button>
                            <span className="absolute right-0 top-full mt-1 w-48 text-[10px] bg-black text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">Email changes require support verification.</span>
                        </div>
                    </div>

                    {/* MOBILE */}
                    <div className="p-6 flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold mb-1">Mobile number</h3>
                            {editMode === 'MOBILE' ? (
                                <div className="max-w-sm mt-3">
                                    <label className="block text-xs font-bold mb-1">New mobile number</label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-[#565959] bg-[#F0F2F2] px-3 py-1.5 border border-[#D5D9D9] rounded-[4px]">+91</span>
                                        <input
                                            value={tempData.mobile}
                                            onChange={e => setTempData({ ...tempData, mobile: e.target.value })}
                                            className="flex-1 border border-[#888C8C] rounded-[4px] py-1.5 px-3 focus:ring-1 focus:ring-teal-600 focus:outline-none focus:border-teal-600"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    {error && <p className="text-xs text-red-600 flex items-center gap-1 mb-2"><AlertCircle size={10} /> {error}</p>}
                                    <p className="text-xs text-[#565959] mb-3">We will send a verification code to verify this number.</p>
                                    <div className="flex gap-2">
                                        <button onClick={saveField} className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-[8px] text-sm shadow-sm hover:bg-[#F7CA00]">Verified & Save</button>
                                        <button onClick={cancelEdit} className="text-sm hover:underline px-2">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[14px]">+91 {user.mobile}</p>
                            )}
                        </div>
                        {editMode !== 'MOBILE' && (
                            <button onClick={() => startEdit('MOBILE')} className="bg-white border border-[#D5D9D9] px-6 py-1.5 rounded-[8px] text-sm shadow-sm hover:bg-[#F7FAFA]">Edit</button>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="p-6 flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold mb-1">Password</h3>
                            {editMode === 'PASSWORD' ? (
                                <div className="max-w-sm mt-3 space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Current password</label>
                                        <input type="password"
                                            className="w-full border border-[#888C8C] rounded-[4px] py-1.5 px-3 focus:ring-1 focus:ring-teal-600 focus:outline-none"
                                            value={tempData.currentPass} onChange={e => setTempData({ ...tempData, currentPass: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">New password</label>
                                        <div className="relative">
                                            <input
                                                type={showPass ? "text" : "password"}
                                                className="w-full border border-[#888C8C] rounded-[4px] py-1.5 px-3 focus:ring-1 focus:ring-teal-600 focus:outline-none"
                                                value={tempData.newPass} onChange={e => setTempData({ ...tempData, newPass: e.target.value })}
                                            />
                                            <button onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#565959] hover:text-[#111]">
                                                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-[#565959] mt-1">Passwords must be at least 6 characters.</p>
                                    </div>
                                    {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={10} /> {error}</p>}
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={saveField} className="bg-[#FFD814] border border-[#FCD200] px-4 py-1.5 rounded-[8px] text-sm shadow-sm hover:bg-[#F7CA00]">Update password</button>
                                        <button onClick={cancelEdit} className="text-sm hover:underline px-2">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[14px]">********</p>
                            )}
                        </div>
                        {editMode !== 'PASSWORD' && (
                            <button onClick={() => startEdit('PASSWORD')} className="bg-white border border-[#D5D9D9] px-6 py-1.5 rounded-[8px] text-sm shadow-sm hover:bg-[#F7FAFA]">Edit</button>
                        )}
                    </div>

                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={() => navigate('/profile')} className="text-sm text-[#007185] hover:underline hover:text-[#C7511F]">Back to Account</button>
                </div>

            </div>
        </div>
    );
};

export default ProfileSecurity;
