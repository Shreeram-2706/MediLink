import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';

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

const DoctorsList = () => {
  const {
    doctors,
    loading,
    changeAvailability,
    getAllDoctors,
    updateDoctor,
    deleteDoctor
  } = useContext(AdminContext);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewMode, setViewMode] = useState('view');
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: 'General Physician',
    degree: '',
    experience: '1',
    about: '',
    fees: '',
    hospital: '',
    hospitalType: 'clinic',
    hospitalCategory: 'private',
    domain: 'Allopathy',
    houseVisit: false,
    address: {
      address: '',
      city: '',
      state: ''
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    getAllDoctors();
  }, []);

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setViewMode('view');
  };

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setViewMode('edit');
    setEditFormData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience.replace(/\D/g, '') || '1',
      about: doctor.about,
      fees: doctor.fees,
      hospital: doctor.hospital,
      hospitalType: doctor.hospitalType || 'clinic',
      hospitalCategory: doctor.hospitalCategory || 'private',
      domain: doctor.domain || 'Allopathy',
      houseVisit: doctor.houseVisit || false,
      address: doctor.address || {
        address: '',
        city: '',
        state: ''
      }
    });
    setImagePreview(doctor.image || '');
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (type === 'checkbox') {
      setEditFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateDoctor = async () => {
    try {
      const formData = new FormData();

      // Add all fields to formData
      formData.append('name', editFormData.name);
      formData.append('email', editFormData.email);
      formData.append('speciality', editFormData.speciality);
      formData.append('degree', editFormData.degree);
      formData.append('experience', editFormData.experience);
      formData.append('about', editFormData.about);
      formData.append('fees', editFormData.fees);
      formData.append('hospital', editFormData.hospital);
      formData.append('hospitalType', editFormData.hospitalType);
      formData.append('hospitalCategory', editFormData.hospitalCategory);
      formData.append('domain', editFormData.domain);
      formData.append('houseVisit', editFormData.houseVisit);

      // Add address fields separately
      formData.append('address', editFormData.address.address);
      formData.append('city', editFormData.address.city);
      formData.append('state', editFormData.address.state);

      // Only add password if it's changed
      if (editFormData.password) {
        formData.append('password', editFormData.password);
      }

      // Add image if changed
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Show loading state
      toast.info('Updating doctor information...', { autoClose: false, toastId: 'updating-doctor' });

      const success = await updateDoctor(selectedDoctor._id, formData);

      if (success) {
        toast.dismiss('updating-doctor');
        toast.success('Doctor updated successfully');
        setViewMode('view');
        setImageFile(null);

        // Update local state with new data
        const updatedDoctor = {
          ...selectedDoctor,
          ...editFormData,
          image: imagePreview || selectedDoctor.image,
          address: {
            address: editFormData.address.address,
            city: editFormData.address.city,
            state: editFormData.address.state
          }
        };
        setSelectedDoctor(updatedDoctor);
        getAllDoctors();
      } else {
        toast.dismiss('updating-doctor');
        toast.error('Failed to update doctor');
      }
    } catch (error) {
      toast.dismiss('updating-doctor');
      toast.error(error.message || 'Failed to update doctor');
      console.error('Update doctor error:', error);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        await deleteDoctor(doctorId);
        toast.success('Doctor deleted successfully');
        setSelectedDoctor(null);
        getAllDoctors();
      } catch (error) {
        toast.error(error.message || 'Failed to delete doctor');
      }
    }
  };

  const toggleAvailability = async (doctorId, currentStatus) => {
    try {
      await changeAvailability(doctorId, !currentStatus);
      toast.success('Availability updated successfully');
      getAllDoctors();
    } catch (error) {
      toast.error(error.message || 'Failed to update availability');
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Doctors Management</h1>
          <div className="text-sm text-gray-500">
            {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'} Registered
          </div>
        </div>

        {doctors.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors found</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="w-[280px] bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  className="w-full h-48 object-cover"
                  src={doctor.image || 'https://via.placeholder.com/300'}
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div className="p-4">
                  {/* Availability Row with Checkbox */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={doctor.available}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleAvailability(doctor._id, doctor.available);
                        }}
                        className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className={`text-sm font-medium ${doctor.available ? 'text-green-600' : 'text-gray-500'}`}>
                        {doctor.available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{doctor.speciality}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {doctor.domain}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {doctor.hospitalCategory === 'private' ? 'Private' : 'Government'}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleViewDoctor(doctor)}
                      className="text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Doctor Details Modal */}
        {selectedDoctor && viewMode === 'view' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{selectedDoctor.name}</h2>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                      className="w-full h-64 object-cover rounded-lg"
                      src={selectedDoctor.image || 'https://via.placeholder.com/300'}
                      alt={selectedDoctor.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300';
                      }}
                    />
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleEditClick(selectedDoctor)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(selectedDoctor._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{selectedDoctor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Speciality</p>
                        <p className="text-gray-800">{selectedDoctor.speciality}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Degree</p>
                        <p className="text-gray-800">{selectedDoctor.degree}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-gray-800">{selectedDoctor.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fees</p>
                        <p className="text-gray-800">₹{selectedDoctor.fees}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Domain</p>
                        <p className="text-gray-800">{selectedDoctor.domain}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hospital/Clinic</p>
                        <p className="text-gray-800">{selectedDoctor.hospital}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Institution Type</p>
                        <p className="text-gray-800">
                          {selectedDoctor.hospitalType === 'hospital' ? 'Hospital' : 'Clinic'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Institution Category</p>
                        <p className="text-gray-800">
                          {selectedDoctor.hospitalCategory === 'private' ? 'Private' : 'Government'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Home Visits</p>
                        <p className="text-gray-800">
                          {selectedDoctor.houseVisit ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`inline-flex items-center ${selectedDoctor.available ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDoctor.available ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500">About</p>
                      <p className="text-gray-800">{selectedDoctor.about}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">
                        {selectedDoctor.address?.address}, {selectedDoctor.address?.city}, {selectedDoctor.address?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Doctor Modal */}
        {selectedDoctor && viewMode === 'edit' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Doctor</h2>
                  <button
                    onClick={() => setViewMode('view')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        name="password"
                        value={editFormData.password}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        minLength="6"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Speciality*</label>
                      <select
                        name="speciality"
                        value={editFormData.speciality}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      >
                        {specialities.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree*</label>
                      <input
                        type="text"
                        name="degree"
                        value={editFormData.degree}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)*</label>
                      <input
                        type="number"
                        name="experience"
                        value={editFormData.experience}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        min="0"
                        max="50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">About*</label>
                      <textarea
                        name="about"
                        value={editFormData.about}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows="3"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees (₹)*</label>
                      <input
                        type="number"
                        name="fees"
                        value={editFormData.fees}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        min="0"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clinic Name*</label>
                      <input
                        type="text"
                        name="hospital"
                        value={editFormData.hospital}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
                        <select
                          name="hospitalType"
                          value={editFormData.hospitalType}
                          onChange={handleEditFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="clinic">Clinic</option>
                          <option value="hospital">Hospital</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution Category</label>
                        <select
                          name="hospitalCategory"
                          value={editFormData.hospitalCategory}
                          onChange={handleEditFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="private">Private</option>
                          <option value="government">Government</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Domain*</label>
                      <select
                        name="domain"
                        value={editFormData.domain}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      >
                        {domains.map((domain) => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        name="houseVisit"
                        checked={editFormData.houseVisit}
                        onChange={handleEditFormChange}
                        className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Available for home visits
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                  <input
                    type="text"
                    name="address.address"
                    value={editFormData.address.address || ''}
                    onChange={handleEditFormChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.city"
                      value={editFormData.address.city || ''}
                      onChange={handleEditFormChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={editFormData.address.state || ''}
                      onChange={handleEditFormChange}
                      placeholder="State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setViewMode('view')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateDoctor}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <TailSpin color="#FFFFFF" height={20} width={20} />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;