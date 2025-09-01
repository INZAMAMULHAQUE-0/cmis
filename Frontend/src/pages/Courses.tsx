import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, User, GraduationCap } from 'lucide-react';
import { Course } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  // Mock data for courses
  const mockCourses: Course[] = [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      credits: 3,
      department: 'Computer Science',
      semester: 1,
      instructor: 'Dr. Sarah Johnson',
      description: 'Fundamentals of programming using Python. Covers basic syntax, data structures, and algorithms.'
    },
    {
      id: '2',
      courseCode: 'CS201',
      courseName: 'Data Structures & Algorithms',
      credits: 4,
      department: 'Computer Science',
      semester: 3,
      instructor: 'Prof. Michael Chen',
      description: 'Advanced data structures, algorithm analysis, and problem-solving techniques.'
    },
    {
      id: '3',
      courseCode: 'MATH101',
      courseName: 'Calculus I',
      credits: 4,
      department: 'Mathematics',
      semester: 1,
      instructor: 'Dr. Emily Rodriguez',
      description: 'Differential and integral calculus with applications to science and engineering.'
    },
    {
      id: '4',
      courseCode: 'PHY101',
      courseName: 'Physics I',
      credits: 4,
      department: 'Physics',
      semester: 1,
      instructor: 'Prof. David Wilson',
      description: 'Mechanics, waves, and thermodynamics with laboratory component.'
    },
    {
      id: '5',
      courseCode: 'ENG101',
      courseName: 'English Composition',
      credits: 3,
      department: 'English',
      semester: 1,
      instructor: 'Dr. Lisa Thompson',
      description: 'Academic writing, critical thinking, and communication skills development.'
    },
    {
      id: '6',
      courseCode: 'CS301',
      courseName: 'Database Systems',
      credits: 3,
      department: 'Computer Science',
      semester: 5,
      instructor: 'Dr. James Park',
      description: 'Database design, SQL, normalization, and database management systems.'
    },
    {
      id: '7',
      courseCode: 'MATH201',
      courseName: 'Linear Algebra',
      credits: 3,
      department: 'Mathematics',
      semester: 3,
      instructor: 'Prof. Amanda Lee',
      description: 'Vector spaces, matrices, eigenvalues, and linear transformations.'
    },
    {
      id: '8',
      courseCode: 'CS401',
      courseName: 'Software Engineering',
      credits: 4,
      department: 'Computer Science',
      semester: 7,
      instructor: 'Dr. Robert Kim',
      description: 'Software development lifecycle, project management, and team collaboration.'
    }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses');
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          // adapt shape if needed
          setCourses(res.data.map((c: any) => ({ id: c._id, courseCode: c.code, courseName: c.title, credits: c.credits, department: c.department || c.description || 'General', semester: 1, instructor: '', description: c.description || '' })));
        } else {
          setCourses(mockCourses);
        }
      } catch (err) {
        setCourses(mockCourses);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const { user } = useAuth();
  const isAdmin = (user as any)?.role === 'admin';

  // Admin: add/edit/delete handlers (very small UI)
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ courseCode: '', courseName: '', credits: 3, department: '', description: '' });

  const refresh = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/courses');
      if (res && res.success) setCourses(res.data.map((c: any) => ({ id: c._id, courseCode: c.code, courseName: c.title, credits: c.credits, department: c.department || c.description || 'General', semester: 1, instructor: '', description: c.description || '' })));
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ courseCode: '', courseName: '', credits: 3, department: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ courseCode: c.courseCode, courseName: c.courseName, credits: c.credits, department: c.department, description: c.description });
    setShowForm(true);
  };

  const submitForm = async () => {
    try {
      if (editing) {
        await api.put(`/api/courses/${editing.id}`, { title: form.courseName, code: form.courseCode, credits: form.credits, department: form.department, description: form.description });
      } else {
        await api.post('/api/courses', { title: form.courseName, code: form.courseCode, credits: form.credits, department: form.department, description: form.description });
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      // noop
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await api.del(`/api/courses/${id}`);
      await refresh();
    } catch (err) {
      // noop
    }
  };

  const departments = ['All', ...Array.from(new Set(courses.map(course => course.department)))];

  const filteredCourses = selectedDepartment === 'All' 
    ? courses 
    : courses.filter(course => course.department === selectedDepartment);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore all available courses with detailed information about credits, instructors, and course content.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDepartment === dept
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              {/* Course Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-600">{course.courseCode}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {course.courseName}
                  </h3>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  {course.credits} Credits
                </span>
              </div>

              {/* Course Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {course.department}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Semester {course.semester}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {course.instructor}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {course.description}
              </p>

              {/* Action Button */}
              <div className="space-y-2">
                <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                  View Details
                </button>

                {isAdmin && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => openEdit(course)} className="flex-1 bg-yellow-50 text-yellow-700 py-2 px-2 rounded-md">Edit</button>
                    <button onClick={() => handleDelete(course.id)} className="flex-1 bg-red-50 text-red-700 py-2 px-2 rounded-md">Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin create/edit form */}
      {isAdmin && (
        <div className="mt-6">
          {!showForm ? (
            <div className="flex justify-end">
              <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-md">Add Course</button>
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })} placeholder="Course Code" className="border p-2 rounded" />
                <input value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} placeholder="Course Name" className="border p-2 rounded" />
                <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department" className="border p-2 rounded" />
                <input value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} placeholder="Credits" type="number" className="border p-2 rounded" />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border p-2 rounded col-span-1 md:col-span-2" />
              </div>
              <div className="flex gap-2 justify-end mt-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={submitForm} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
              </div>
            </div>
          )}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No courses found for the selected department.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;