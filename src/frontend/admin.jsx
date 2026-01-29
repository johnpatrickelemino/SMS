import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, FileText, Settings, BarChart3, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { db } from '../backend/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminInfo, setAdminInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [students, setStudents] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    studentId: '',
    email: '',
    course: '',
    yearLevel: '',
    status: 'Active',
    role: 'Student',
  });
  const [editStudent, setEditStudent] = useState({
    fullName: '',
    studentId: '',
    email: '',
    course: '',
    yearLevel: '',
    status: 'Active',
  });

  // Fetch students from Firebase
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const studentsList = [];
      const profilesList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'Student' || data.role === 'student') {
          studentsList.push({
            id: doc.id,
            fullName: `${data.fullName}`,
            studentId: data.studentId || '',
            email: data.email || '',
            course: data.course || 'Not Specified',
            yearLevel: data.yearLevel || 'Not Specified',
            status: data.status || 'Active',
            role: data.role,
          });
          
          profilesList.push({
            id: doc.id,
            name: data.fullName || '',
            completedDate: data.profileCompletedDate || null,
            status: data.profileCompletedDate ? 'Completed' : 'Pending',
          });
        }
      });
      
      setStudents(studentsList);
      setProfiles(profilesList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students from database');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated and is an Admin
    const isAuthenticated = sessionStorage.getItem('IsAuthenticated');
    const userRole = sessionStorage.getItem('Role');

    if (!isAuthenticated || userRole !== 'Admin') {
      navigate('/login');
      return;
    }

    // Set admin info from sessionStorage
    setAdminInfo({
      firstName: sessionStorage.getItem('FirstName') || '',
      lastName: sessionStorage.getItem('LastName') || '',
      email: sessionStorage.getItem('Email') || '',
    });

    // Fetch students from Firebase
    fetchStudents();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (newStudent.fullName && newStudent.studentId && newStudent.email && newStudent.course) {
      try {
        const docRef = await addDoc(collection(db, 'users'), {
          fullName: newStudent.fullName,
          studentId: newStudent.studentId,
          email: newStudent.email,
          course: newStudent.course,
          yearLevel: newStudent.yearLevel,
          status: newStudent.status,
          role: 'Student',
          createdAt: new Date(),
        });
        
        setStudents([
          ...students,
          {
            id: docRef.id,
            fullName: newStudent.fullName,
            studentId: newStudent.studentId,
            email: newStudent.email,
            course: newStudent.course,
            yearLevel: newStudent.yearLevel,
            status: newStudent.status,
            role: 'Student',
          },
        ]);
        
        setNewStudent({
          fullName: '',
          studentId: '',
          email: '',
          course: '',
          yearLevel: '',
          status: 'Active',
          role: 'Student',
        });
        setShowModal(false);
      } catch (err) {
        console.error('Error adding student:', err);
        setError('Failed to add student');
      }
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setStudents(students.filter(student => student.id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student');
    }
  };

  const handleUpdateStudentStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', id), {
        status: newStatus,
      });
      setStudents(students.map(student =>
        student.id === id ? { ...student, status: newStatus } : student
      ));
    } catch (err) {
      console.error('Error updating student status:', err);
      setError('Failed to update student status');
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student.id);
    setEditStudent({
      fullName: student.fullName,
      studentId: student.studentId,
      email: student.email,
      course: student.course,
      yearLevel: student.yearLevel,
      status: student.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEditStudent = async (e) => {
    e.preventDefault();
    if (editingStudent && editStudent.fullName && editStudent.studentId && editStudent.email && editStudent.course) {
      try {
        await updateDoc(doc(db, 'users', editingStudent), {
          fullName: editStudent.fullName,
          studentId: editStudent.studentId,
          email: editStudent.email,
          course: editStudent.course,
          yearLevel: editStudent.yearLevel,
          status: editStudent.status,
        });
        
        setStudents(students.map(student =>
          student.id === editingStudent
            ? {
                ...student,
                fullName: editStudent.fullName,
                studentId: editStudent.studentId,
                email: editStudent.email,
                course: editStudent.course,
                yearLevel: editStudent.yearLevel,
                status: editStudent.status,
              }
            : student
        ));
        
        setShowEditModal(false);
        setEditingStudent(null);
        setEditStudent({
          fullName: '',
          studentId: '',
          email: '',
          course: '',
          yearLevel: '',
          status: 'Active',
        });
      } catch (err) {
        console.error('Error updating student:', err);
        setError('Failed to update student');
      }
    }
  };

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(student => student.status === 'Active').length,
    completedProfiles: profiles.filter(p => p.status === 'Completed').length,
    pendingProfiles: profiles.filter(p => p.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header className="shadow-md" style={{ backgroundColor: '#3a5a40' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-200 text-sm">Collegio De Montalban Student Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white text-right">
              <p className="font-semibold">{adminInfo.firstName} {adminInfo.lastName}</p>
              <p className="text-sm text-gray-200">{adminInfo.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'dashboard'
                ? 'border-b-2 text-green-600'
                : 'bg-black hover:text-green-500'
            }`}
          >
            <BarChart3 className="inline mr-2" size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'students'
                ? 'border-b-2 text-green-600'
                : 'bg-black hover:text-green-500'
            }`}
          >
            <Users className="inline mr-2" size={20} />
            Students
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'profiles'
                ? 'border-b-2 text-green-600'
                : 'bg-black hover:text-green-500'
            }`}
          >
            <FileText className="inline mr-2" size={20} />
            Profiles
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'settings'
                ? 'border-b-2 text-green-600'
                : 'bg-black hover:text-green-500'
            }`}
          >
            <Settings className="inline mr-2" size={20} />
            Settings
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: '#3a5a40' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
                  </div>
                  <Users size={40} style={{ color: '#3a5a40' }} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Active Students</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.activeStudents}</p>
                  </div>
                  <CheckCircle size={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Completed Profiles</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.completedProfiles}</p>
                  </div>
                  <FileText size={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Pending Profiles</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.pendingProfiles}</p>
                  </div>
                  <Clock size={40} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              {students.length === 0 ? (
                <p className="text-gray-600 text-sm">No students added yet.</p>
              ) : (
                <div className="space-y-3">
                  {students.slice(0, 5).map((student) => (
                    <p key={student.id} className="text-gray-600 text-sm">
                      ✓ {student.fullName} - {student.course} ({student.status})
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Add Student Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-md">
                  <h3 className="text-xl font-bold text-black mb-4">Add New Student</h3>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newStudent.fullName}
                      onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="student ID"
                      value={newStudent.studentId}
                      onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Course"
                      value={newStudent.course}
                      onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Year Level"
                      value={newStudent.yearLevel}
                      onChange={(e) => setNewStudent({ ...newStudent, yearLevel: e.target.value })}
                      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Add Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading students...</p>
              </div>
            ) : (
              <>
                {/* Students Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {students.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No students found. Add your first student to get started.</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b-2">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Full Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year Level</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-800">{student.fullName}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{student.studentId}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{student.course}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{student.yearLevel}</td>
                            <td className="px-6 py-4 text-sm">
                              <select
                                value={student.status}
                                onChange={(e) => handleUpdateStudentStatus(student.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-white font-semibold ${
                                  student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditStudent(student)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Edit Student Modal */}
                {showEditModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                      <h3 className="text-xl font-bold text-black mb-4">Edit Student Information</h3>
                      <form onSubmit={handleSaveEditStudent} className="space-y-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={editStudent.fullName}
                          onChange={(e) => setEditStudent({ ...editStudent, fullName: e.target.value })}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Student ID"
                          value={editStudent.studentId}
                          onChange={(e) => setEditStudent({ ...editStudent, studentId: e.target.value })}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={editStudent.email}
                          onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Course"
                          value={editStudent.course}
                          onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Year Level"
                          value={editStudent.yearLevel}
                          onChange={(e) => setEditStudent({ ...editStudent, yearLevel: e.target.value })}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          required
                        />
                        <select
                          value={editStudent.status}
                          onChange={(e) => setEditStudent({ ...editStudent, status: e.target.value })}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          required
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEditModal(false);
                              setEditingStudent(null);
                            }}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Profiles</h2>
            <div className="grid grid-cols-1 gap-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {profile.status === 'Completed'
                          ? `Completed on: ${profile.completedDate}`
                          : 'Status: Pending'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {profile.status === 'Completed' ? (
                        <>
                          <CheckCircle className="text-green-500" size={24} />
                          <span className="text-green-600 font-semibold">Completed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-orange-500" size={24} />
                          <span className="text-orange-600 font-semibold">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">First Name</label>
                      <p className="text-gray-800 mt-1">{adminInfo.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Last Name</label>
                      <p className="text-gray-800 mt-1">{adminInfo.lastName}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <p className="text-gray-800 mt-1">{adminInfo.email}</p>
                  </div>
                </div>

                <hr className="border-gray-300" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600"><span className="font-semibold">System Name:</span> CDM HR Profiling System</p>
                    <p className="text-gray-600"><span className="font-semibold">Version:</span> 1.0.0</p>
                    <p className="text-gray-600"><span className="font-semibold">Last Updated:</span> January 2025</p>
                  </div>
                </div>

                <hr className="border-gray-300" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h3>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;