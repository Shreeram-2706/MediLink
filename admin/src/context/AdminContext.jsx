import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://medilink-backend-tqkc.onrender.com";
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [loading, setLoading] = useState(false);

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } });
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to change doctor availability using API
    const changeAvailability = async (docId, currentStatus) => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/change-availability',
                { docId, available: !currentStatus },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Refresh doctors list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Update Doctor function
    const updateDoctor = async (docId, formData) => {
        setLoading(true);
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/update-doctor/${docId}`,
                formData,
                {
                    headers: {
                        'aToken': aToken,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Refresh doctors list
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Update doctor error:", error);
            toast.error(error.response?.data?.message || 'Failed to update doctor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Delete Doctor function
    const deleteDoctor = async (docId) => {
        setLoading(true);
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/delete-doctor/${docId}`,
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Refresh doctors list
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Delete doctor error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete doctor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment',
                { appointmentId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments(); // Refresh appointments list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        aToken, setAToken,
        doctors, appointments, dashData, loading,
        getAllDoctors, changeAvailability, updateDoctor, deleteDoctor,
        getAllAppointments, cancelAppointment, getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
