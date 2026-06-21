import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const allSpecialties = ['General Physician',
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

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [filterDoc, setFilterDoc] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Filter logic
  useEffect(() => {
    let filtered = doctors;

    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilterDoc(filtered);
  }, [doctors, speciality, searchQuery]);

  const handleSpecialtyChange = (e) => {
    const selected = e.target.value;
    if (selected === '') {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${selected}`);
    }
  };

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm sm:hidden transition-all ${showFilter ? 'bg-teal-600 text-white' : ''}`}
        >
          Filters
        </button>

        {/* Specialty Dropdown */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <select
            value={speciality || ''}
            onChange={handleSpecialtyChange}
            className='border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
          >
            <option value=''>All Specialties</option>
            {allSpecialties.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className='flex-1'>
          {/* Search Input with Icon */}
          <div className='relative mb-6 sm:mb-0'>
            <input
              type='text'
              placeholder='Search doctor by name'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
            />
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          </div>

          {/* Doctor Cards */}
          <div className='w-full grid grid-cols-auto gap-4 gap-y-6 mt-4'>
            {filterDoc.length > 0 ? filterDoc.map((item, index) => (
              <div
                onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
                className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                key={index}
              >
                <img className='w-full h-48 object-cover' src={item.image} alt={item.name} />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                  <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                </div>
              </div>
            )) : (
              <p className='text-gray-500 mt-6'>No doctors found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;