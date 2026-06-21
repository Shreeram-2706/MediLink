import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const domains = [
    'Allopathy',
    'Ayurveda',
    'Homeopathy',
    'Unani',
    'Siddha',
    'Naturopathy',
    'Yoga'
];

const specialities = [
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Gastroenterologist',
    'Cardiologist',
    'Dentist',
    'Endocrinologist',
    'ENT Specialist',
    'Diabetologist',
    'Nephrologist',
    'Oncologist',
    'Orthopedist',
    'Psychiatrist',
    'Pulmonologist',
    'Radiologist',
    'Rheumatologist',
    'Urologist'
];

const hospitalTypes = ['clinic', 'hospital'];
const hospitalCategories = ['private', 'government'];

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
    const { currency, backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Format experience to ensure consistency
    const formatExperience = (exp) => {
        if (!exp) return '0 years';
        const numericValue = exp.toString().replace(/\s*(Year|Years)\s*/i, '');
        const years = parseInt(numericValue, 10) || 0;
        return `${years} year${years !== 1 ? 's' : ''}`;
    };

    // Update profile function
    const updateProfile = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            
            // Append all fields to formData
            formData.append('name', profileData.name);
            formData.append('email', profileData.email);
            if (profileData.password) formData.append('password', profileData.password);
            formData.append('speciality', profileData.speciality);
            formData.append('degree', profileData.degree);
            formData.append('experience', profileData.experience);
            formData.append('about', profileData.about);
            formData.append('available', profileData.available);
            formData.append('fees', profileData.fees);
            formData.append('hospital', profileData.hospital || '');
            formData.append('hospitalType', profileData.hospitalType || 'clinic');
            formData.append('hospitalCategory', profileData.hospitalCategory || 'private');
            formData.append('domain', profileData.domain || '');
            formData.append('houseVisit', profileData.houseVisit || false);
            
            // Append address fields separately
            formData.append('address', profileData.address?.address || '');
            formData.append('city', profileData.address?.city || '');
            formData.append('state', profileData.address?.state || '');
            
            if (imageFile) formData.append('image', imageFile);
    
            const { data } = await axios.put(
                `${backendUrl}/api/doctor/update-profile`,
                formData,
                { 
                    headers: { 
                        'dToken': dToken,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
    
            if (data.success) {
                toast.success('Profile updated successfully');
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle availability function
    const toggleAvailability = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/change-availability`,
                {},
                { headers: { dToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                setProfileData(prev => ({
                    ...prev,
                    available: !prev.available
                }));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle house visit function
    const toggleHouseVisit = () => {
        setProfileData(prev => ({
            ...prev,
            houseVisit: !prev.houseVisit
        }));
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setProfileData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setProfileData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }));
        } else if (name === 'experience') {
            const numericValue = value.replace(/\D/g, '');
            setProfileData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            setProfileData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Fetch profile data on mount
    useEffect(() => {
        if (dToken) getProfileData();
    }, [dToken]);

    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Profile Image and Basic Info */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-6">
                        <div className="relative">
                            {isEdit ? (
                                <>
                                    <img
                                        className="w-full h-auto rounded-lg object-cover aspect-square mb-4"
                                        src={imagePreview || profileData.image || 'https://via.placeholder.com/300'}
                                        alt="Doctor Profile"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-sm text-gray-500 mb-4"
                                    />
                                </>
                            ) : (
                                <img
                                    className="w-full h-auto rounded-lg object-cover aspect-square"
                                    src={profileData.image || 'https://via.placeholder.com/300'}
                                    alt="Doctor Profile"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300';
                                    }}
                                />
                            )}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mt-4">
                            {isEdit ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            ) : (
                                profileData.name
                            )}
                        </h2>

                        <div className="mt-2">
                            {isEdit ? (
                                <input
                                    type="text"
                                    name="degree"
                                    value={profileData.degree}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                                    placeholder="Degree"
                                />
                            ) : (
                                <p className="text-gray-600">{profileData.degree}</p>
                            )}
                        </div>

                        <div className="mt-1">
                            {isEdit ? (
                                <select
                                    name="speciality"
                                    value={profileData.speciality}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Speciality</option>
                                    {specialities.map((spec) => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-gray-500">{profileData.speciality}</p>
                            )}
                        </div>

                        <div className="mt-2 flex items-center">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {formatExperience(profileData.experience)}
                            </span>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600 font-medium">
                                Consultation fee:
                                <span className="text-gray-800 ml-2">
                                    {isEdit ? (
                                        <input
                                            type="number"
                                            name="fees"
                                            value={profileData.fees}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        `${currency} ${profileData.fees}`
                                    )}
                                </span>
                            </p>
                        </div>

                        {/* Availability Checkbox */}
                        <div className="mt-4">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={profileData.available || false}
                                    onChange={isEdit ? handleInputChange : toggleAvailability}
                                    className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out rounded focus:ring-teal-500"
                                    disabled={isLoading && !isEdit}
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {profileData.available ? 'Available' : 'Unavailable'}
                                </span>
                            </label>
                        </div>

                        {/* House Visit Checkbox */}
                        {isEdit && (
                            <div className="mt-4">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="houseVisit"
                                        checked={profileData.houseVisit || false}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out rounded focus:ring-teal-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Offers House Visits
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Detailed Information */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                        <button
                            onClick={() => setIsEdit(!isEdit)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${isEdit
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                            disabled={isLoading}
                        >
                            {isEdit ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* About Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                        {isEdit ? (
                            <textarea
                                name="about"
                                value={profileData.about}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={5}
                            />
                        ) : (
                            <p className="text-gray-600 whitespace-pre-line">
                                {profileData.about || 'No information provided'}
                            </p>
                        )}
                    </div>

                    {/* Professional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Domain</label>
                            {isEdit ? (
                                <select
                                    name="domain"
                                    value={profileData.domain}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Domain</option>
                                    {domains.map((domain) => (
                                        <option key={domain} value={domain}>{domain}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">{profileData.domain || 'Not specified'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Clinic</label>
                            {isEdit ? (
                                <input
                                    type="text"
                                    name="hospital"
                                    value={profileData.hospital}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            ) : (
                                <p className="text-gray-600">{profileData.hospital || 'Not specified'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</label>
                            {isEdit ? (
                                <select
                                    name="hospitalType"
                                    value={profileData.hospitalType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {hospitalTypes.map(type => (
                                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">
                                    {profileData.hospitalType ? 
                                        profileData.hospitalType.charAt(0).toUpperCase() + profileData.hospitalType.slice(1) : 
                                        'Not specified'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Category</label>
                            {isEdit ? (
                                <select
                                    name="hospitalCategory"
                                    value={profileData.hospitalCategory}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {hospitalCategories.map(category => (
                                        <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">
                                    {profileData.hospitalCategory ? 
                                        profileData.hospitalCategory.charAt(0).toUpperCase() + profileData.hospitalCategory.slice(1) : 
                                        'Not specified'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            {isEdit ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            ) : (
                                <p className="text-gray-600">{profileData.email || 'Not specified'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                            {isEdit ? (
                                <input
                                    type="text"
                                    name="experience"
                                    value={profileData.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g. 5"
                                />
                            ) : (
                                <p className="text-gray-600">{formatExperience(profileData.experience)}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Field (only in edit mode) */}
                    {isEdit && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={profileData.password || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="New password"
                                />
                            </div>
                        </div>
                    )}

                    {/* Address Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        {isEdit ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    name="address.address"
                                    value={profileData.address?.address || ''}
                                    onChange={handleInputChange}
                                    placeholder="Street Address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={profileData.address?.city || ''}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={profileData.address?.state || ''}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>=
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                <p>{profileData.address?.address || 'Not specified'}</p>
                                <p>{profileData.address?.city || ''}, {profileData.address?.state || ''}</p>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    {isEdit && (
                        <div className="flex justify-end">
                            <button
                                onClick={updateProfile}
                                disabled={isLoading}
                                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;