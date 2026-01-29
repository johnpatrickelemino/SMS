import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, Award, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, FileText, ClipboardCheck, Bell } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const aboutCollegioRef = useRef(null);

  const features = [
    { 
      icon: BookOpen, 
      title: "Course Enrollment", 
      description: "Easy online enrollment system for students to register for classes each semester with real-time availability updates."
    },
    { 
      icon: FileText, 
      title: "Grade Management", 
      description: "Access grades, transcripts, and academic performance reports anytime, anywhere through a secure portal."
    },
    { 
      icon: Calendar, 
      title: "Schedule & Attendance", 
      description: "View class schedules, track attendance records, and receive notifications for upcoming classes and exams."
    },
    { 
      icon: Award, 
      title: "Academic Records", 
      description: "Maintain comprehensive student profiles with academic history, achievements, and official documentation."
    },
    { 
      icon: ClipboardCheck, 
      title: "Assignment Tracking", 
      description: "Submit assignments online, track deadlines, and receive feedback from instructors all in one place."
    },
    { 
      icon: Bell, 
      title: "Announcements", 
      description: "Stay updated with important school announcements, events, and deadline reminders through instant notifications."
    }
  ];

  const studentServices = [
    { title: "Enrollment Services", department: "Registrar's Office", status: "Active" },
    { title: "Grade Inquiry", department: "Academic Affairs", status: "Active" },
    { title: "Scholarship Programs", department: "Student Services", status: "Active" },
    { title: "Library Services", department: "Library", status: "Active" },
    { title: "Student ID Processing", department: "Registrar's Office", status: "Active" },
    { title: "Certificate Requests", department: "Registrar's Office", status: "Active" }
  ];

  const developers = [
    { name: "John Patrick Elemino", role: "Full Stack Developer", email: "johnpatrickelemino@gmail.com" },
    { name: "John Christian Joyo", role: "Frontend Developer", email: "joyobading@gmail.com" },
    { name: "Robert Smith", role: "Backend Developer", email: "robert.smith@cdm.edu" },
    { name: "Oni Johnson", role: "UI/UX Designer", email: "oni.johnson@cdm.edu" },
    { name: "Alex Chen", role: "Database Admin", email: "alex.chen@cdm.edu" },
    { name: "Maria Garcia", role: "QA Engineer", email: "maria.garcia@cdm.edu" },
    { name: "David Lee", role: "System Analyst", email: "david.lee@cdm.edu" },
    { name: "Sarah Kim", role: "Project Manager", email: "sarah.kim@cdm.edu" }
  ];

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3a5a40' }}>
      {/* Header/Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#3a5a40' }}>
              CDM
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Colegio de Montalban</h1>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="text-white px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: '#3a5a40' }}
          >
            Student Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-yellow-400 mb-6">
          Welcome to CDM Student Management System
        </h2>
        <p className="text-xl text-yellow-200 mb-8 max-w-3xl mx-auto">
          Your all-in-one platform for managing academic records, enrollment, grades, and student services at Colegio de Montalban.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => scrollToSection(featuresRef)}
            className="text-white px-8 py-3 rounded-lg font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: '#0DAC50' }}
          >
            Explore Features
          </button>
          <button 
            onClick={() => scrollToSection(aboutCollegioRef)}
            className="text-amber-50 px-8 py-3 rounded-lg font-semibold text-lg transition duration-300 shadow-lg border-2 border-white hover:scale-105"
            style={{ backgroundColor: '#186A02' }}
          >
            About CDM
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">System Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
                <feature.icon className="h-12 w-12 mx-auto mb-4" style={{ color: '#3a5a40' }} />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Information */}
      <section ref={aboutCollegioRef} className="py-16 text-yellow-400" style={{ backgroundColor: '#3a5a40' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-center">About Colegio de Montalban</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg mb-6">
              Established on September 25, 2003 by virtue of Municipal Ordinance No. 03-24, and approved by the Sangguniang Bayan ng Rodriguez to provide vocational-technical and higher education to help alleviate poverty.
            </p>
            <p className="text-lg mb-6">
              At present, Colegio de Montalban continues to work towards the holistic development of its students through innovative education and comprehensive student support services.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-green-950 bg-opacity-20 rounded-lg p-6 hover:bg-opacity-30 transition duration-300">
                <h3 className="text-3xl font-bold mb-2">4,000+</h3>
                <p className="text-lg">Students Enrolled</p>
              </div>
              <div className="bg-green-950 bg-opacity-20 rounded-lg p-6 hover:bg-opacity-30 transition duration-300">
                <h3 className="text-3xl font-bold mb-2">150+</h3>
                <p className="text-lg">Faculty Members</p>
              </div>
              <div className="bg-green-950 bg-opacity-20 rounded-lg p-6 hover:bg-opacity-30 transition duration-300">
                <h3 className="text-3xl font-bold mb-2">10</h3>
                <p className="text-lg">Degree Programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Student Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentServices.map((service, index) => (
              <div key={index} className="bg-gradient from-green-50 to-green-100 rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 border" style={{ borderColor: '#3a5a40' }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
                  <span className="text-white text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#0DAC50' }}>{service.status}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.department}</p>
                <button className="w-full text-white py-2 rounded-lg font-semibold transition duration-300 hover:opacity-90" style={{ backgroundColor: '#3a5a40' }}>
                  Access Service
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Developers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Development Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Meet the talented developers who built this comprehensive student management system with dedication and expertise.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {developers.map((dev, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-xl transition duration-300">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: '#3a5a40' }}>
                  {dev.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{dev.name}</h3>
                <p className="mb-4" style={{ color: '#3a5a40' }}>{dev.role}</p>
                <a href={`mailto:${dev.email}`} className="text-gray-600 hover:opacity-80 transition duration-300 text-sm">
                  {dev.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{ backgroundColor: '#2d3e31' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl text-yellow-400 font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-yellow-400 hover:text-white transition duration-300">Student Portal</a></li>
                <li><a href="#" className="text-yellow-400 hover:text-white transition duration-300">Course Catalog</a></li>
                <li><a href="#" className="text-yellow-400 hover:text-white transition duration-300">Academic Calendar</a></li>
                <li><a href="#" className="text-yellow-400 hover:text-white transition duration-300">Support Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl text-yellow-400 font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-3 rounded-full transition duration-300 hover:opacity-80" style={{ backgroundColor: '#3a5a40' }}>
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="p-3 rounded-full transition duration-300 hover:opacity-80" style={{ backgroundColor: '#3a5a40' }}>
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="p-3 rounded-full transition duration-300 hover:opacity-80" style={{ backgroundColor: '#3a5a40' }}>
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-3 rounded-full transition duration-300 hover:opacity-80" style={{ backgroundColor: '#3a5a40' }}>
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-yellow-400 font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 shrink-0 text-yellow-400" />
                  <span className="text-yellow-400">Kasiglahan Village, Rodriguez, Philippines, 1860</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 shrink-0 text-yellow-400" />
                  <span className="text-yellow-400">0930-383-4605</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 shrink-0 text-yellow-400" />
                  <span className="text-yellow-400">info@cdm.edu.ph</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-yellow-400">
            <p>&copy; 2025 Colegio de Montalban Student Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}