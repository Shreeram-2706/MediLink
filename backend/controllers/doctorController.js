import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Helper function to handle errors
const handleError = (res, error, context = '') => {
    console.error(`Error ${context}:`, error);
    return res.status(500).json({ 
        success: false, 
        message: error.message || `An error occurred while ${context || 'processing your request'}`
    });
};

// API for doctor Login 
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const user = await doctorModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // Omit password from response
        const userData = user.toObject();
        delete userData.password;

        res.json({ 
            success: true, 
            token,
            user: userData
        });

    } catch (error) {
        handleError(res, error, 'logging in doctor');
    }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId, status } = req.body;

        if (!docId) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor ID is required" 
            });
        }

        let query = { docId };
        if (status) {
            if (status === 'completed') {
                query.isCompleted = true;
            } else if (status === 'upcoming') {
                query.isCompleted = false;
                query.cancelled = false;
            } else if (status === 'cancelled') {
                query.cancelled = true;
            }
        }

        const appointments = await appointmentModel.find(query)
            .populate('userId', 'name email')
            .sort({ date: -1, time: -1 });

        res.json({ 
            success: true, 
            appointments 
        });

    } catch (error) {
        handleError(res, error, 'fetching doctor appointments');
    }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        if (!docId || !appointmentId) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor ID and Appointment ID are required" 
            });
        }

        const appointment = await appointmentModel.findOneAndUpdate(
            { _id: appointmentId, docId },
            { cancelled: true },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: "Appointment not found or you don't have permission to cancel it" 
            });
        }

        res.json({ 
            success: true, 
            message: 'Appointment cancelled successfully',
            appointment
        });

    } catch (error) {
        handleError(res, error, 'cancelling appointment');
    }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        if (!docId || !appointmentId) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor ID and Appointment ID are required" 
            });
        }

        const appointment = await appointmentModel.findOneAndUpdate(
            { _id: appointmentId, docId },
            { isCompleted: true },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: "Appointment not found or you don't have permission to complete it" 
            });
        }

        res.json({ 
            success: true, 
            message: 'Appointment marked as completed',
            appointment
        });

    } catch (error) {
        handleError(res, error, 'completing appointment');
    }
};

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {
        const { speciality, domain, search } = req.query;

        let query = {};

        if (speciality) {
            query.speciality = speciality;
        }

        if (domain) {
            query.domain = domain;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { speciality: { $regex: search, $options: 'i' } },
                { hospital: { $regex: search, $options: 'i' } }
            ];
        }

        const doctors = await doctorModel.find(query)
            .select(['-password', '-email'])
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            count: doctors.length,
            doctors 
        });

    } catch (error) {
        handleError(res, error, 'fetching doctor list');
    }
};

// API to change doctor availability for Admin and Doctor Panel
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor ID is required" 
            });
        }

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }

        doctor.available = !doctor.available;
        await doctor.save();

        res.json({ 
            success: true, 
            message: 'Availability changed successfully',
            available: doctor.available 
        });

    } catch (error) {
        handleError(res, error, 'changing doctor availability');
    }
};

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor ID is required" 
            });
        }

        const profileData = await doctorModel.findById(docId)
            .select('-password')
            .lean();

        if (!profileData) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }

        // Ensure address object exists
        profileData.address = profileData.address || {};

        res.json({ 
            success: true, 
            profileData 
        });

    } catch (error) {
        handleError(res, error, 'fetching doctor profile');
    }
};

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            available,
            fees,
            hospital,
            hospitalType,
            hospitalCategory,
            domain,
            houseVisit,
            address,
            city,
            state,
            country,
            pincode,
            docId  // This is set by the authDoctor middleware
        } = req.body;

        // Get doctor ID either from req.user (preferred) or from req.body.docId (fallback)
        const doctorId = req.user?.id || docId;
        
        if (!doctorId) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required. Please login." 
            });
        }

        // Basic validation
        if (!name || !email || !speciality || !degree) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, email, speciality and degree are required fields" 
            });
        }

        const updateData = {
            name,
            email,
            speciality,
            degree,
            experience: parseInt(experience) || 0,
            about: about || '',
            available: available === 'true' || available === true,
            fees: parseInt(fees) || 0,
            hospital: hospital || '',
            hospitalType: hospitalType || 'clinic',
            hospitalCategory: hospitalCategory || 'private',
            domain: domain || '',
            houseVisit: houseVisit === 'true' || houseVisit === true,
            address: {
                address: address || '',
                city: city || '',
                state: state || '',
                country: country || '',
                pincode: pincode || ''
            }
        };

        // Handle password update if provided
        if (password && password.trim() !== '') {
            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Password must be at least 6 characters long" 
                });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Handle image upload if provided
        if (req.file) {
            updateData.image = req.file.path;
        }

        console.log("Updating doctor with ID:", doctorId); // Debug log

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedDoctor) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            doctor: updatedDoctor
        });

    } catch (error) {
        handleError(res, error, 'updating doctor profile');
    }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor ID is required" 
            });
        }

        const [appointments, doctor] = await Promise.all([
            appointmentModel.find({ docId }),
            doctorModel.findById(docId).select('available')
        ]);

        let earnings = 0;
        const completedAppointments = [];
        const patients = new Set();

        appointments.forEach(item => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount || 0;
                completedAppointments.push(item);
            }
            patients.add(item.userId.toString());
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            completedAppointments: completedAppointments.length,
            pendingAppointments: appointments.length - completedAppointments.length,
            patients: patients.size,
            available: doctor.available,
            latestAppointments: appointments
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
        };

        res.json({ 
            success: true, 
            dashData 
        });

    } catch (error) {
        handleError(res, error, 'fetching doctor dashboard');
    }
};

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorList,
    changeAvailability,
    doctorProfile,
    updateDoctorProfile,
    doctorDashboard
};