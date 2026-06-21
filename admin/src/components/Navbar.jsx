import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiLogOut } from 'react-icons/fi'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
      toast.success('Doctor logged out successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
      toast.success('Admin logged out successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img 
          onClick={() => navigate('/')} 
          className='w-36 sm:w-40 cursor-pointer' 
          src={assets.admin_logo} 
          alt="Logo" 
        />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button 
        onClick={logout} 
        className='flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-full hover:bg-primary-dark transition-colors'
      >
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  )
}

export default Navbar