import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User, Award, Clock, CheckCircle } from 'lucide-react';
import { db } from '../backend/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [studentInfo, setStudentInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    course: '',
    yearLevel: '',
    enrollmentDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated and is a Student
    const isAuthenticated = sessionStorage.getItem('IsAuthenticated');
    const userRole = sessionStorage.getItem('Role');

    if (!isAuthenticated || userRole !== 'Student') {
      navigate('/login');
      return;
    }

    // Set student info from sessionStorage
    const firstName = sessionStorage.getItem('FirstName') || '';
    const lastName = sessionStorage.getItem('LastName') || '';
    const email = sessionStorage.getItem('Email') || '';
    const uid = sessionStorage.getItem('uid');

    setStudentInfo({
      firstName,
      lastName,
      email,
      studentId: '',
      course: '',
      yearLevel: '',
      enrollmentDate: '',
    });

    // Fetch student data from Firestore
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        if (uid) {
          const studentDoc = await getDoc(doc(db, 'users', uid));
          if (studentDoc.exists()) {
            const data = studentDoc.data();
            setStudentInfo((prev) => ({
              ...prev,
              studentId: data.studentId || '',
              course: data.course || 'Not Specified',
              yearLevel: data.yearLevel || 'Not Specified',
              enrollmentDate: data.enrollmentDate || '',
            }));
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student information');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleEnrollment = async () => {
    try {
      setEnrollmentLoading(true);
      setEnrollmentMessage('');

      const response = await fetch('http://localhost:5198/api/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentInfo.studentId,
          email: studentInfo.email,
          firstName: studentInfo.firstName,
          lastName: studentInfo.lastName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Get the UID from sessionStorage
        const uid = sessionStorage.getItem('uid');
        
        // Update Firestore with enrollment date
        if (uid) {
          await updateDoc(doc(db, 'users', uid), {
            enrollmentDate: data.enrollmentDate,
            enrolledAt: new Date(),
          });
        }

        // Update studentInfo with the enrollment date
        setStudentInfo((prev) => ({
          ...prev,
          enrollmentDate: data.enrollmentDate,
        }));
        setEnrollmentMessage('✓ Successfully enrolled! Enrollment date set to today. Confirmation email sent.');
      } else {
        setEnrollmentMessage('Error: ' + (data.message || 'Failed to enroll'));
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      setEnrollmentMessage('Error: Could not connect to server. Make sure the API is running on http://localhost:5198');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <header className="shadow-lg" style={{ backgroundColor: '#1e40af' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">Student Dashboard</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-white text-right">
              <p className="font-semibold text-lg">{studentInfo.firstName} {studentInfo.lastName}</p>
              <p className="text-blue-100 text-sm">{studentInfo.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg flex items-center space-x-2 transition duration-200 font-semibold"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 font-semibold transition border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <User className="inline mr-2" size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-2 font-semibold transition border-b-2 ${
                activeTab === 'courses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <BookOpen className="inline mr-2" size={20} />
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-2 font-semibold transition border-b-2 ${
                activeTab === 'progress'
                  ? 'border-green-700 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <CheckCircle className="inline mr-2" size={20} />
              Progress
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <User className="mr-3 text-blue-600" size={28} />
                  My Profile
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Full Name</p>
                    <p className="text-gray-800 text-lg font-semibold">{studentInfo.firstName} {studentInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Email</p>
                    <p className="text-gray-800 text-lg">{studentInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Student ID</p>
                    <p className="text-gray-800 text-lg">{studentInfo.studentId || 'Not Set'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <BookOpen className="mr-3 text-green-600" size={28} />
                  Academic Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Course</p>
                    <p className="text-gray-800 text-lg font-semibold">{studentInfo.course}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Year Level</p>
                    <p className="text-gray-800 text-lg font-semibold">{studentInfo.yearLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Status</p>
                    <div className="flex items-center mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-green-700 font-semibold">Active</p>
                    </div>
                    <div>
                      <button 
                        onClick={handleEnrollment}
                        disabled={enrollmentLoading}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
                      >
                        {enrollmentLoading ? 'Enrolling...' : 'Enroll'}
                      </button>
                      {enrollmentMessage && (
                        <p className={`mt-2 text-sm ${enrollmentMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                          {enrollmentMessage}
                        </p>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm font-semibold">Enrollment Date</p>
                      <p className="text-gray-800 text-lg">{studentInfo.enrollmentDate || 'Not enrolled yet'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">4</p>
                  </div>
                  <BookOpen size={40} className="text-purple-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Completed Tasks</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
                  </div>
                  <CheckCircle size={40} className="text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Overall Progress</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">75%</p>
                  </div>
                  <Award size={40} className="text-orange-600 opacity-20" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">My Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Web Development', 'Data Structures', 'Business Analytics', 'Advanced Java'].map((course, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{course}</h3>
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Complete your assignments and track your progress in this course.</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">Progress</p>
                        <p className="text-sm font-semibold text-blue-600">{60 + index * 10}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${60 + index * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Progress</h2>
            <div className="space-y-6">
              {[
                { task: 'Complete Profile Information', status: 'Completed', date: 'Jan 5, 2026' },
                { task: 'Submit Course Registration', status: 'Completed', date: 'Jan 4, 2026' },
                { task: 'Attend Orientation', status: 'Completed', date: 'Jan 3, 2026' },
                { task: 'Submit Assignment 1', status: 'In Progress', date: 'Due: Jan 15, 2026' },
                { task: 'Midterm Exam Preparation', status: 'Pending', date: 'Due: Feb 1, 2026' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between border-l-4"
                  style={{
                    borderColor:
                      item.status === 'Completed'
                        ? '#10b981'
                        : item.status === 'In Progress'
                        ? '#f59e0b'
                        : '#6b7280',
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {item.status === 'Completed' && (
                      <CheckCircle className="text-green-600" size={28} />
                    )}
                    {item.status === 'In Progress' && (
                      <Clock className="text-orange-600" size={28} />
                    )}
                    {item.status === 'Pending' && (
                      <div className="w-7 h-7 rounded-full border-2 border-gray-400"></div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{item.task}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      item.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'In Progress'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;