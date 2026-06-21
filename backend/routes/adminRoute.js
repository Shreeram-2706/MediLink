// routes/adminRouter.js
import express from 'express';
import {
  loginAdmin,
  adminDashboard,
  allDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  changeDoctorAvailability,
  appointmentsAdmin,
  appointmentCancel
} from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Authentication
router.post("/login", loginAdmin);

// Dashboard
router.get("/dashboard", authAdmin, adminDashboard);

// Doctor Management
router.get("/all-doctors", authAdmin, allDoctors);
router.post("/add-doctor", authAdmin, upload.single('image'), addDoctor);
router.put("/update-doctor/:docId", authAdmin, upload.single('image'), updateDoctor);
router.delete("/delete-doctor/:docId", authAdmin, deleteDoctor);
router.post("/change-availability", authAdmin, changeDoctorAvailability);

// Appointments
router.get("/appointments", authAdmin, appointmentsAdmin);
router.post("/cancel-appointment", authAdmin, appointmentCancel);

export default router;