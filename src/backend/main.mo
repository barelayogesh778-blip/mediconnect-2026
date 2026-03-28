import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module DoctorProfile {
    public func compareByRating(p1 : DoctorProfile, p2 : DoctorProfile) : Order.Order {
      Nat.compare(p1.rating, p2.rating);
    };
  };

  module Hospital {
    public func compare(h1 : Hospital, h2 : Hospital) : Order.Order {
      Nat.compare(h1.id, h2.id);
    };
  };

  module CommunityEvent {
    public func compareByDate(e1 : CommunityEvent, e2 : CommunityEvent) : Order.Order {
      Text.compare(e1.dateTime, e2.dateTime);
    };
  };

  // Storage
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type AppointmentStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  type AppointmentType = {
    #consultation;
    #diagnostic;
  };

  type DoctorProfile = {
    id : Nat;
    name : Text;
    specialty : Text;
    credentials : Text;
    bio : Text;
    verified : Bool;
    rating : Nat;
    reviewCount : Nat;
    available : Bool;
    hospitalId : Nat;
    consultationFee : Nat;
  };

  type Hospital = {
    id : Nat;
    name : Text;
    address : Text;
    departments : [Text];
    erWaitMinutes : Nat;
    rating : Nat;
    reviewCount : Nat;
    description : Text;
    featuredDepartment : Text;
    isSponsored : Bool;
  };

  type Appointment = {
    id : Nat;
    patientId : Principal;
    doctorId : Nat;
    hospitalId : Nat;
    appointmentType : AppointmentType;
    dateTime : Text;
    status : AppointmentStatus;
    notes : Text;
  };

  type ReviewTargetType = {
    #doctor;
    #hospital;
  };

  type Review = {
    id : Nat;
    authorId : Principal;
    targetId : Nat;
    targetType : ReviewTargetType;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  type EventType = {
    #popupClinic;
    #webinar;
    #nutritionTour;
  };

  type CommunityEvent = {
    id : Nat;
    title : Text;
    description : Text;
    eventType : EventType;
    location : Text;
    dateTime : Text;
    organizer : Text;
  };

  public type UserProfile = {
    name : Text;
    role : Text; // "Patient", "Doctor", "HospitalAdmin"
    associatedId : ?Nat; // doctorId or hospitalId if applicable
  };

  // State
  let doctorProfiles = Map.empty<Nat, DoctorProfile>();
  let hospitals = Map.empty<Nat, Hospital>();
  let appointments = Map.empty<Nat, Appointment>();
  let reviews = Map.empty<Nat, Review>();
  let communityEvents = Map.empty<Nat, CommunityEvent>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Map doctor/hospital IDs to their Principal owners
  let doctorOwners = Map.empty<Nat, Principal>();
  let hospitalOwners = Map.empty<Nat, Principal>();

  let symptomSpecialtyMap = Map.empty<Text, Text>();
  var nextDoctorId = 0;
  var nextHospitalId = 0;
  var nextAppointmentId = 0;
  var nextReviewId = 0;
  var nextEventId = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper functions
  func getDoctorByIdInternal(id : Nat) : DoctorProfile {
    switch (doctorProfiles.get(id)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doctor) { doctor };
    };
  };

  func getHospitalByIdInternal(id : Nat) : Hospital {
    switch (hospitals.get(id)) {
      case (null) { Runtime.trap("Hospital not found") };
      case (?hospital) { hospital };
    };
  };

  func isDoctorOwner(caller : Principal, doctorId : Nat) : Bool {
    switch (doctorOwners.get(doctorId)) {
      case (null) { false };
      case (?owner) { Principal.equal(caller, owner) };
    };
  };

  func isHospitalOwner(caller : Principal, hospitalId : Nat) : Bool {
    switch (hospitalOwners.get(hospitalId)) {
      case (null) { false };
      case (?owner) { Principal.equal(caller, owner) };
    };
  };

  // Doctors
  public shared ({ caller }) func createDoctorProfile(profile : DoctorProfile) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create doctors");
    };
    let id = nextDoctorId;
    nextDoctorId += 1;
    let newProfile : DoctorProfile = {
      profile with
      id;
      verified = false;
      rating = 0;
      reviewCount = 0;
    };
    doctorProfiles.add(id, newProfile);
    id;
  };

  public shared ({ caller }) func updateDoctorProfile(id : Nat, profile : DoctorProfile) : async () {
    if (not (isDoctorOwner(caller, id) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the doctor owner or admins can update this profile");
    };
    let existing = getDoctorByIdInternal(id);
    doctorProfiles.add(id, { profile with id; verified = existing.verified });
  };

  public query ({ caller }) func getDoctor(id : Nat) : async DoctorProfile {
    getDoctorByIdInternal(id);
  };

  public query ({ caller }) func getDoctorsBySpecialty(specialty : Text) : async [DoctorProfile] {
    doctorProfiles.values().toArray().filter(func(p) { p.specialty == specialty });
  };

  public query ({ caller }) func getTopRatedDoctors() : async [DoctorProfile] {
    doctorProfiles.values().toArray().sort(DoctorProfile.compareByRating).sliceToArray(0, 10);
  };

  public shared ({ caller }) func verifyDoctor(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can verify doctors");
    };
    let profile = getDoctorByIdInternal(id);
    doctorProfiles.add(id, { profile with verified = true });
  };

  public shared ({ caller }) func assignDoctorOwner(doctorId : Nat, owner : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can assign doctor owners");
    };
    ignore getDoctorByIdInternal(doctorId); // Verify doctor exists
    doctorOwners.add(doctorId, owner);
  };

  // Hospitals
  public shared ({ caller }) func createHospital(hospital : Hospital) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create hospitals");
    };
    let id = nextHospitalId;
    nextHospitalId += 1;
    let newHospital : Hospital = {
      hospital with
      id;
      rating = 0;
      reviewCount = 0;
      isSponsored = false;
    };
    hospitals.add(id, newHospital);
    id;
  };

  public shared ({ caller }) func updateHospital(id : Nat, hospital : Hospital) : async () {
    if (not (isHospitalOwner(caller, id) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the hospital owner or admins can update this hospital");
    };
    let existing = getHospitalByIdInternal(id);
    hospitals.add(id, { hospital with id; isSponsored = existing.isSponsored });
  };

  public query ({ caller }) func getHospital(id : Nat) : async Hospital {
    getHospitalByIdInternal(id);
  };

  public query ({ caller }) func getHospitalsByDepartment(department : Text) : async [Hospital] {
    hospitals.values().toArray().filter(func(h) { h.departments.find(func(d) { d == department }) != null });
  };

  public shared ({ caller }) func updateErWaitTime(id : Nat, waitTime : Nat) : async () {
    if (not (isHospitalOwner(caller, id) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the hospital owner or admins can update ER wait time");
    };
    let hospital = getHospitalByIdInternal(id);
    hospitals.add(id, { hospital with erWaitMinutes = waitTime });
  };

  public shared ({ caller }) func assignHospitalOwner(hospitalId : Nat, owner : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can assign hospital owners");
    };
    ignore getHospitalByIdInternal(hospitalId); // Verify hospital exists
    hospitalOwners.add(hospitalId, owner);
  };

  // Appointments
  public shared ({ caller }) func bookAppointment(appointment : Appointment) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can book appointments");
    };
    // Verify that the caller is booking for themselves
    if (not Principal.equal(caller, appointment.patientId)) {
      Runtime.trap("Unauthorized: You can only book appointments for yourself");
    };
    let id = nextAppointmentId;
    nextAppointmentId += 1;
    let newAppointment : Appointment = {
      appointment with id;
      patientId = caller; // Ensure patientId is the caller
      status = #pending;
    };
    appointments.add(id, newAppointment);
    id;
  };

  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : AppointmentStatus) : async () {
    let appointment = switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) { appointment };
    };
    
    // Only the doctor involved or admins can update appointment status
    if (not (isDoctorOwner(caller, appointment.doctorId) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the assigned doctor or admins can update appointment status");
    };
    
    appointments.add(id, { appointment with status });
  };

  public query ({ caller }) func getPatientAppointments(patientId : Principal) : async [Appointment] {
    // Patients can only see their own appointments, admins can see all
    if (not (Principal.equal(caller, patientId) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: You can only view your own appointments");
    };
    appointments.values().toArray().filter(func(a) { Principal.equal(a.patientId, patientId) });
  };

  public query ({ caller }) func getDoctorAppointments(doctorId : Nat) : async [Appointment] {
    // Only the specific doctor or admins can access this
    if (not (isDoctorOwner(caller, doctorId) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the doctor or admins can view these appointments");
    };
    appointments.values().toArray().filter(func(a) { a.doctorId == doctorId });
  };

  // Reviews
  public shared ({ caller }) func addReview(review : Review) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    let id = nextReviewId;
    nextReviewId += 1;
    let newReview : Review = {
      review with id;
      authorId = caller;
      timestamp = Time.now();
    };
    reviews.add(id, newReview);
    id;
  };

  public query ({ caller }) func getReviewsByTarget(targetId : Nat, targetType : ReviewTargetType) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.targetId == targetId and r.targetType == targetType });
  };

  // Community Events
  public shared ({ caller }) func createEvent(event : CommunityEvent) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    let id = nextEventId;
    nextEventId += 1;
    let newEvent : CommunityEvent = {
      event with id;
    };
    communityEvents.add(id, newEvent);
    id;
  };

  public query ({ caller }) func getEvent(id : Nat) : async CommunityEvent {
    switch (communityEvents.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };

  public query ({ caller }) func getEventsByType(eventType : EventType) : async [CommunityEvent] {
    communityEvents.values().toArray().filter(func(e) { e.eventType == eventType }).sort(CommunityEvent.compareByDate);
  };

  // Symptom-to-specialty matching
  public query ({ caller }) func getMatchingSpecialties(symptom : Text) : async [Text] {
    let lowerSymptom = symptom.toArray().map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } }).toText();

    let results = List.empty<Text>();
    for ((key, value) in symptomSpecialtyMap.entries()) {
      if (key.contains(#text lowerSymptom)) {
        results.add(value);
      };
    };
    results.toArray();
  };

  // Search
  public query ({ caller }) func searchDoctors(searchTerm : Text) : async [DoctorProfile] {
    let term = searchTerm.toArray().map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } }).toText();

    doctorProfiles.values().toArray().filter(
      func(p) {
        p.name.contains(#text term) or p.specialty.contains(#text term) or p.credentials.contains(#text term) or p.bio.contains(#text term)
      }
    );
  };

  public query ({ caller }) func searchHospitals(searchTerm : Text) : async [Hospital] {
    let term = searchTerm.toArray().map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } }).toText();

    hospitals.values().toArray().filter(
      func(h) {
        h.name.contains(#text term) or h.address.contains(#text term) or h.description.contains(#text term) or h.featuredDepartment.contains(#text term)
      }
    ).sort();
  };
};
