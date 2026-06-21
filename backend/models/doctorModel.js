import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true,
        enum: [
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
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    fees: {
        type: Number,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    hospitalType: {
        type: String,
        enum: ['clinic', 'hospital'],
        default: 'clinic'
    },
    hospitalCategory: {
        type: String,
        enum: ['private', 'government'],
        default: 'private'
    },
    domain: {
        type: String,
        required: true,
        enum: [
            'Allopathy',
            'Ayurveda',
            'Homeopathy',
            'Unani',
            'Siddha',
            'Naturopathy',
            'Yoga'
        ]
    },
    houseVisit: {
        type: Boolean,
        default: false
    },
    slots_booked: {
        type: Object,
        default: {}
    },
    address: { type: Object, required: true },

    date: {
        type: Number,
        required: true
    },
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;