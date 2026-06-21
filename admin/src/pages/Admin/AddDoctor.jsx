import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { TailSpin } from 'react-loader-spinner'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General Physician')
    const [degree, setDegree] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [hospital, setHospital] = useState('')
    const [hospitalType, setHospitalType] = useState('clinic') // 'clinic' or 'hospital'
    const [hospitalCategory, setHospitalCategory] = useState('private') // 'government' or 'private'
    const [domain, setDomain] = useState('Allopathy')
    const [houseVisit, setHouseVisit] = useState(false)
    const [loading, setLoading] = useState(false)

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const domains = [
        'Allopathy',
        'Ayurveda',
        'Homeopathy',
        'Unani',
        'Siddha',
        'Naturopathy',
        'Yoga'
    ]

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
    ]

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setLoading(true)

        try {
            if (!docImg) {
                setLoading(false)
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', `${experience} Year${experience !== '1' ? 's' : ''}`)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('hospital', hospital)
            formData.append('hospitalType', hospitalType)
            formData.append('hospitalCategory', hospitalCategory)
            formData.append('domain', domain)
            formData.append('houseVisit', houseVisit)
            formData.append('address', JSON.stringify({ 
                address, 
                city, 
                state
            }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { 
                headers: { aToken } 
            })

            if (data.success) {
                toast.success(data.message)
                // Reset all form fields
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress('')
                setCity('')
                setState('')
                setHospital('')
                setHospitalType('clinic')
                setHospitalCategory('private')
                setDegree('')
                setAbout('')
                setFees('')
                setExperience('1')
                setDomain('Allopathy')
                setHouseVisit(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <div className='flex items-center justify-between mb-6'>
                <p className='text-2xl font-bold text-gray-800'>Add New Doctor</p>
            </div>

            <div className='bg-white px-8 py-8 border rounded-lg shadow-sm w-full max-w max-h-[80vh] overflow-y-auto'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img" className='cursor-pointer'>
                        <div className='relative'>
                            <img 
                                className='w-24 h-24 object-cover bg-gray-100 rounded-full border-2 border-gray-200' 
                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                alt="Doctor" 
                            />
                            <div className='absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
                    <div>
                        <p className='font-medium'>Upload doctor picture</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Full Name</label>
                            <input 
                                onChange={e => setName(e.target.value)} 
                                value={name} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="text" 
                                placeholder='Enter your Name' 
                                required 
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Email Address</label>
                            <input 
                                onChange={e => setEmail(e.target.value)} 
                                value={email} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="email" 
                                placeholder='Enter your email' 
                                required 
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Password</label>
                            <input 
                                onChange={e => setPassword(e.target.value)} 
                                value={password} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="password" 
                                placeholder='••••••••' 
                                required 
                                minLength="6"
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Experience (Years)</label>
                            <input 
                                onChange={e => setExperience(e.target.value.replace(/\D/, ''))} 
                                value={experience} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="text" 
                                placeholder='Enter the experience in years' 
                                required 
                                maxLength="2"
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Medical Domain</label>
                            <select 
                                onChange={e => setDomain(e.target.value)} 
                                value={domain} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent'
                            >
                                {domains.map((d, i) => (
                                    <option key={i} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Consultation Fees</label>
                            <div className='relative'>
                                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>₹</span>
                                <input 
                                    onChange={e => setFees(e.target.value)} 
                                    value={fees} 
                                    className='border rounded-lg px-4 py-2 pl-8 w-full focus:ring-2 focus:ring-primary focus:border-transparent' 
                                    type="number" 
                                    placeholder='Enter consultation fees' 
                                    required 
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Speciality</label>
                            <select 
                                onChange={e => setSpeciality(e.target.value)} 
                                value={speciality} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent'
                            >
                                {specialities.map((spec, i) => (
                                    <option key={i} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Degree</label>
                            <input 
                                onChange={e => setDegree(e.target.value)} 
                                value={degree} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="text" 
                                placeholder='Enter your degree' 
                                required 
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Institution Name</label>
                            <input 
                                onChange={e => setHospital(e.target.value)} 
                                value={hospital} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="text" 
                                placeholder='Enter the name of Hospital/Clinic' 
                                required 
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-gray-600'>Institution Type</label>
                                <select 
                                    onChange={e => setHospitalType(e.target.value)} 
                                    value={hospitalType} 
                                    className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent'
                                >
                                    <option value="clinic">Clinic</option>
                                    <option value="hospital">Hospital</option>
                                </select>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-gray-600'>Institution Category</label>
                                <select 
                                    onChange={e => setHospitalCategory(e.target.value)} 
                                    value={hospitalCategory} 
                                    className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent'
                                >
                                    <option value="private">Private</option>
                                    <option value="government">Government</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <input 
                                type="checkbox" 
                                id="houseVisit" 
                                checked={houseVisit} 
                                onChange={(e) => setHouseVisit(e.target.checked)} 
                                className='h-4 w-4 text-primary rounded focus:ring-primary'
                            />
                            <label htmlFor="houseVisit" className='text-gray-600'>
                                Available for home visits
                            </label>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600'>Address</label>
                            <input 
                                onChange={e => setAddress(e.target.value)} 
                                value={address} 
                                className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                type="text" 
                                placeholder='Street address' 
                                required 
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-gray-600'>City</label>
                                <input 
                                    onChange={e => setCity(e.target.value)} 
                                    value={city} 
                                    className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                    type="text" 
                                    placeholder='City' 
                                    required 
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-gray-600'>State</label>
                                <input 
                                    onChange={e => setState(e.target.value)} 
                                    value={state} 
                                    className='border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent' 
                                    type="text" 
                                    placeholder='State' 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <label className='block text-gray-600 mb-2'>About Doctor</label>
                    <textarea 
                        onChange={e => setAbout(e.target.value)} 
                        value={about} 
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent' 
                        rows={4} 
                        placeholder='Brief description about the doctor...'
                    ></textarea>
                </div>

                <div className='mt-8 flex justify-end'>
                    <button 
                        type='submit' 
                        className='bg-primary hover:bg-primary-dark px-8 py-3 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-200'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <TailSpin color="#FFFFFF" height={20} width={20} />
                                Adding Doctor...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Add Doctor
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddDoctor