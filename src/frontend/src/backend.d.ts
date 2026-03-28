import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: bigint;
    authorId: Principal;
    comment: string;
    timestamp: bigint;
    targetType: ReviewTargetType;
    rating: bigint;
    targetId: bigint;
}
export interface CommunityEvent {
    id: bigint;
    organizer: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    eventType: EventType;
}
export interface DoctorProfile {
    id: bigint;
    bio: string;
    verified: boolean;
    name: string;
    available: boolean;
    specialty: string;
    credentials: string;
    hospitalId: bigint;
    rating: bigint;
    reviewCount: bigint;
    consultationFee: bigint;
}
export interface Hospital {
    id: bigint;
    erWaitMinutes: bigint;
    featuredDepartment: string;
    departments: Array<string>;
    isSponsored: boolean;
    name: string;
    description: string;
    address: string;
    rating: bigint;
    reviewCount: bigint;
}
export interface Appointment {
    id: bigint;
    status: AppointmentStatus;
    doctorId: bigint;
    patientId: Principal;
    appointmentType: AppointmentType;
    hospitalId: bigint;
    notes: string;
    dateTime: string;
}
export interface UserProfile {
    name: string;
    role: string;
    associatedId?: bigint;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum AppointmentType {
    diagnostic = "diagnostic",
    consultation = "consultation"
}
export enum EventType {
    webinar = "webinar",
    nutritionTour = "nutritionTour",
    popupClinic = "popupClinic"
}
export enum ReviewTargetType {
    hospital = "hospital",
    doctor = "doctor"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(review: Review): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignDoctorOwner(doctorId: bigint, owner: Principal): Promise<void>;
    assignHospitalOwner(hospitalId: bigint, owner: Principal): Promise<void>;
    bookAppointment(appointment: Appointment): Promise<bigint>;
    createDoctorProfile(profile: DoctorProfile): Promise<bigint>;
    createEvent(event: CommunityEvent): Promise<bigint>;
    createHospital(hospital: Hospital): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDoctor(id: bigint): Promise<DoctorProfile>;
    getDoctorAppointments(doctorId: bigint): Promise<Array<Appointment>>;
    getDoctorsBySpecialty(specialty: string): Promise<Array<DoctorProfile>>;
    getEvent(id: bigint): Promise<CommunityEvent>;
    getEventsByType(eventType: EventType): Promise<Array<CommunityEvent>>;
    getHospital(id: bigint): Promise<Hospital>;
    getHospitalsByDepartment(department: string): Promise<Array<Hospital>>;
    getMatchingSpecialties(symptom: string): Promise<Array<string>>;
    getPatientAppointments(patientId: Principal): Promise<Array<Appointment>>;
    getReviewsByTarget(targetId: bigint, targetType: ReviewTargetType): Promise<Array<Review>>;
    getTopRatedDoctors(): Promise<Array<DoctorProfile>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchDoctors(searchTerm: string): Promise<Array<DoctorProfile>>;
    searchHospitals(searchTerm: string): Promise<Array<Hospital>>;
    updateAppointmentStatus(id: bigint, status: AppointmentStatus): Promise<void>;
    updateDoctorProfile(id: bigint, profile: DoctorProfile): Promise<void>;
    updateErWaitTime(id: bigint, waitTime: bigint): Promise<void>;
    updateHospital(id: bigint, hospital: Hospital): Promise<void>;
    verifyDoctor(id: bigint): Promise<void>;
}
