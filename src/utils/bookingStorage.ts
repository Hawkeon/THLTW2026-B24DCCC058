import moment from 'moment';

export interface WorkingDay {
    day: number; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm
    endTime: string; // HH:mm
}

export interface Staff {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    note?: string;
    maxCustomersPerDay: number;
    schedule: WorkingDay[];
}

export interface Service {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    description?: string;
    status: 'active' | 'inactive';
}

export interface Appointment {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    staffId: string;
    status: 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
    note?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    appointmentId: string;
    staffId: string;
    serviceId: string;
    customerName: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string;
    staffReply?: string;
}

const KEYS = {
    STAFF: 'booking_staff',
    SERVICES: 'booking_services',
    APPOINTMENTS: 'booking_appointments',
    REVIEWS: 'booking_reviews'
};

export const bookingStorage = {
    getStaff: (): Staff[] => JSON.parse(localStorage.getItem(KEYS.STAFF) || '[]'),
    saveStaff: (data: Staff[]) => localStorage.setItem(KEYS.STAFF, JSON.stringify(data)),
    
    getServices: (): Service[] => JSON.parse(localStorage.getItem(KEYS.SERVICES) || '[]'),
    saveServices: (data: Service[]) => localStorage.setItem(KEYS.SERVICES, JSON.stringify(data)),
    
    getAppointments: (): Appointment[] => JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]'),
    saveAppointments: (data: Appointment[]) => localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(data)),
    
    getReviews: (): Review[] => JSON.parse(localStorage.getItem(KEYS.REVIEWS) || '[]'),
    saveReviews: (data: Review[]) => localStorage.setItem(KEYS.REVIEWS, JSON.stringify(data))
};
