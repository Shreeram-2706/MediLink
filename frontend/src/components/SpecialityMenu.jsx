import React, { useState } from 'react';
import { specialityData } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const SpecialityMenu = () => {
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    const maxVisible = 10; // Show only 8 items initially (2 rows of 4)
    const visibleItems = showAll ? specialityData : specialityData.slice(0, maxVisible);

    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Find by Speciality</h1>
            <p className='sm:w-1/3 text-center text-sm'>
                Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
            </p>

            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-10 gap-6 pt-5'>
                {visibleItems.map((item, index) => (
                    <Link
                    to={`/doctors/${item.speciality}`}
                    onClick={() => scrollTo(0, 0)}
                    className='flex flex-col items-center text-xs cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                    key={index}
                  >
                    <div className='w-16 h-16 sm:w-24 sm:h-24 mb-2 border border-teal-100 rounded-full flex items-center justify-center'>
                      <img
                        className='w-10 h-10 sm:w-16 sm:h-16 object-contain'
                        src={item.image}
                        alt={item.speciality}
                      />
                    </div>
                    <p>{item.speciality}</p>
                  </Link>
                  
                ))}
            </div>

            {specialityData.length > maxVisible && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className='bg-teal-100 text-gray-600 px-12 py-3 rounded-full mt-10'
                >
                    {showAll ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
};

export default SpecialityMenu;
