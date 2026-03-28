# MediConnect 2026 - Healthcare Ecosystem App

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- **Patient Portal**: Symptom checker (AI-style NLP input), hospital/doctor discovery with specialty ranking, insurance filter
- **Doctor Profiles**: Verified doctor cards with specialty, credentials, ratings, availability badge
- **Hospital Listings**: Department showcasing, ER wait times, ratings/reviews, appointment booking
- **Appointment Booking**: One-tap booking flow for consultations and diagnostic tests
- **Reviews & Ratings**: Patients can leave reviews; hospitals/doctors can respond
- **Admin Dashboard**: Hospital admin can manage departments, view bookings, respond to reviews
- **Role-Based Access**: Patient, Doctor, Hospital Admin roles with authorization
- **Symptom-to-Specialist Matching**: Rule-based symptom keywords map to medical specialties
- **Telehealth CTA**: Prominent telehealth option on doctor profiles
- **Community Events**: Pop-up wellness clinic listings and webinar announcements

### Modify
N/A — new project.

### Remove
N/A — new project.

## Implementation Plan
1. Backend: actors for Users (roles), Doctors (profiles, verification), Hospitals (departments, ER wait times), Appointments (booking), Reviews, Events (community wellness)
2. Frontend: Landing page with symptom search, Hospital/Doctor discovery pages, Booking flow, Admin dashboard, Role-based nav
3. Authorization component for role-based access (Patient / Doctor / Admin)
4. Blob-storage for doctor profile photos and hospital images
