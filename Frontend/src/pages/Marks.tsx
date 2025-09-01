import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StudentMarks, Mark } from '../types';
// validation not needed on this page; we fetch for the authenticated user
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Marks: React.FC = () => {
  const [studentMarks, setStudentMarks] = useState<StudentMarks | null>(null);
  // loading state not needed for now
  const { addToast } = useToast();
  const { user } = useAuth();
  const isAdmin = (user as any)?.role === 'admin';
  const [adminMarks, setAdminMarks] = useState<any[]>([]);
  const [adminPage, setAdminPage] = useState<number>(1);
  const [adminLimit, setAdminLimit] = useState<number>(20);
  const [adminTotal, setAdminTotal] = useState<number>(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');

  // semesters extracted from data
  const [semesters, setSemesters] = useState<string[]>(['All']);

  // Mock data for student marks
  const mockStudentMarks: { [key: string]: StudentMarks } = {
    'CS2021001': {
      student: {
        id: '1',
        rollNumber: 'CS2021001',
        name: 'John Doe',
        email: 'john.doe@student.college.edu'
      },
      semester: 'Fall 2024',
      cgpa: 8.5,
      marks: [
        {
          subjectCode: 'CS101',
          subjectName: 'Introduction to Programming',
          internalMarks: 18,
          externalMarks: 72,
          totalMarks: 90,
          grade: 'A+'
        },
        {
          subjectCode: 'MATH101',
          subjectName: 'Calculus I',
          internalMarks: 16,
          externalMarks: 68,
          totalMarks: 84,
          grade: 'A'
        },
        {
          subjectCode: 'PHY101',
          subjectName: 'Physics I',
          internalMarks: 15,
          externalMarks: 65,
          totalMarks: 80,
          grade: 'A'
        },
        {
          subjectCode: 'ENG101',
          subjectName: 'English Composition',
          internalMarks: 17,
          externalMarks: 70,
          totalMarks: 87,
          grade: 'A+'
        },
        {
          subjectCode: 'CS201',
          subjectName: 'Data Structures',
          internalMarks: 19,
          externalMarks: 75,
          totalMarks: 94,
          grade: 'A+'
        }
      ]
    },
    'CS2021002': {
      student: {
        id: '2',
        rollNumber: 'CS2021002',
        name: 'Jane Smith',
        email: 'jane.smith@student.college.edu'
      },
      semester: 'Fall 2024',
      cgpa: 9.2,
      marks: [
        {
          subjectCode: 'CS101',
          subjectName: 'Introduction to Programming',
          internalMarks: 20,
          externalMarks: 78,
          totalMarks: 98,
          grade: 'A+'
        },
        {
          subjectCode: 'MATH101',
          subjectName: 'Calculus I',
          internalMarks: 19,
          externalMarks: 76,
          totalMarks: 95,
          grade: 'A+'
        },
        {
          subjectCode: 'PHY101',
          subjectName: 'Physics I',
          internalMarks: 18,
          externalMarks: 74,
          totalMarks: 92,
          grade: 'A+'
        },
        {
          subjectCode: 'ENG101',
          subjectName: 'English Composition',
          internalMarks: 17,
          externalMarks: 73,
          totalMarks: 90,
          grade: 'A+'
        }
      ]
    }
  };

  // Fetch current user's marks on mount or when semester changes
  useEffect(() => {
  const fetchMarks = async () => {
      try {
  setLoading(true);
        const localUser = localStorage.getItem('cmis_user');
        const userId = (user && (user as any).id) || (localUser ? JSON.parse(localUser).id : null);
        if (!userId) {
      addToast('error', 'User not authenticated');
          return;
        }
        if (isAdmin) {
          const qs = [] as string[];
          if (searchQuery) qs.push(`q=${encodeURIComponent(searchQuery)}`);
          if (selectedSemester && selectedSemester !== 'All') qs.push(`semester=${encodeURIComponent(selectedSemester)}`);
          qs.push(`page=${adminPage}`);
          qs.push(`limit=${adminLimit}`);
          const qstr = qs.length ? `?${qs.join('&')}` : '';
          const res = await api.get(`/api/marks${qstr}`);
          if (res && res.success && res.data && Array.isArray(res.data.items)) {
            setAdminMarks(res.data.items);
            setAdminTotal(res.data.total || 0);
          } else {
            setAdminMarks([]);
            setAdminTotal(0);
          }
          return;
        }

        const qs = selectedSemester && selectedSemester !== 'All' ? `?semester=${encodeURIComponent(selectedSemester)}` : '';
        const res = await api.get(`/api/marks/${encodeURIComponent(userId)}${qs}`);
  if (res && res.success && Array.isArray(res.data)) {
          const marksArr = res.data.map((m: any) => ({ subjectCode: m.courseId?.code || m.courseId, subjectName: m.courseId?.title || m.courseId, internalMarks: 0, externalMarks: m.marksObtained, totalMarks: m.marksObtained, grade: 'N/A', semester: m.semester || 'N/A' }));
          const semSet = new Set<string>();
          marksArr.forEach((x: any) => { if (x.semester) semSet.add(String(x.semester)); });
          const semestersList: string[] = ['All', ...Array.from(semSet)];
          setSemesters(semestersList);
          setStudentMarks({ student: { id: userId, rollNumber: '', name: (user as any)?.name || '', email: (user as any)?.email || '' }, semester: selectedSemester === 'All' ? 'All' : selectedSemester, cgpa: 0, marks: marksArr });
          addToast('success', 'Marks retrieved successfully!');
        } else {
          // fall back to mock for demonstration
          const fallback = mockStudentMarks['CS2021001'];
          setStudentMarks(fallback);
          setSemesters(['All', fallback.semester]);
          addToast('success', 'Marks retrieved (mock)');
        }
      } catch (err) {
        addToast('error', 'An error occurred while fetching marks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [selectedSemester, user, adminPage, adminLimit]);

  // refresh admin list when searchQuery or semester changes
  useEffect(() => {
    if (!isAdmin) return;
    const t = setTimeout(async () => {
      try {
        const qs = [] as string[];
        if (searchQuery) qs.push(`q=${encodeURIComponent(searchQuery)}`);
        if (selectedSemester && selectedSemester !== 'All') qs.push(`semester=${encodeURIComponent(selectedSemester)}`);
        qs.push(`page=${adminPage}`);
        qs.push(`limit=${adminLimit}`);
        const qstr = qs.length ? `?${qs.join('&')}` : '';
        const res = await api.get(`/api/marks${qstr}`);
        if (res && res.success && res.data && Array.isArray(res.data.items)) {
          setAdminMarks(res.data.items);
          setAdminTotal(res.data.total || 0);
        }
      } catch (err) {
        // ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, selectedSemester, isAdmin]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-blue-100 text-blue-800';
      case 'B+':
        return 'bg-yellow-100 text-yellow-800';
      case 'B':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalMarks = (marks: Mark[]) => {
    return marks.reduce((total, mark) => total + mark.totalMarks, 0);
  };

  const calculateMaxMarks = (marks: Mark[]) => {
    return marks.length * 100; // Assuming each subject is out of 100
  };

  const calculatePercentage = (marks: Mark[]) => {
    const total = calculateTotalMarks(marks);
    const max = calculateMaxMarks(marks);
    return ((total / max) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Student Marks</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your Student ID or Roll Number to view your academic performance and grades.
        </p>
      </div>

      {/* Semester Filter (students can pick a semester) */}
      <div className="flex justify-center">
        <div className="space-x-2">
          {semesters.map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSemester === sem ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'}`}
            >
              {sem}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll number"
              className="w-2/3 border p-2 rounded"
            />
            <div className="text-sm text-gray-600">Showing {adminMarks.length} records</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Students' Marks</h3>
            </div>
            <div className="overflow-x-auto">
              {loading && (
                <div className="p-6 flex justify-center items-center">
                  <LoadingSpinner size="md" color="gray" />
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminMarks.map((it, idx) => (
                    <React.Fragment key={it.studentId || idx}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <button onClick={() => {
                            const set = new Set(expandedIds);
                            if (set.has(it.studentId)) set.delete(it.studentId); else set.add(it.studentId);
                            setExpandedIds(set);
                          }} className="text-left">
                            {it.studentName}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{it.rollNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.summary?.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.marks?.[0]?.semester || '-'}</td>
                      </tr>
                      {expandedIds.has(it.studentId) && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-2">
                              {it.marks && it.marks.length ? (
                                <table className="min-w-full bg-white rounded">
                                  <thead>
                                    <tr className="text-sm text-gray-600">
                                      <th className="py-2 text-left">Course</th>
                                      <th className="py-2 text-left">Internal</th>
                                      <th className="py-2 text-left">External</th>
                                      <th className="py-2 text-left">Total</th>
                                      <th className="py-2 text-left">Grade</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {it.marks.map((m: any, mi: number) => (
                                      <tr key={String(m.id || mi)} className={`${mi % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="py-2 pr-4">{m.course?.title || m.course?.name || m.course}</td>
                                        <td className="py-2 pr-4">{m.internalMarks}/20</td>
                                        <td className="py-2 pr-4">{m.externalMarks}/80</td>
                                        <td className="py-2 pr-4">{m.totalMarks}/100</td>
                                        <td className="py-2 pr-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(m.grade)}`}>{m.grade}</span></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : <div className="text-sm text-gray-600">No marks available</div>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing {(adminPage-1)*adminLimit + 1} - {Math.min(adminPage*adminLimit, adminTotal)} of {adminTotal}</div>
              <div className="space-x-2">
                <button disabled={adminPage<=1} onClick={() => setAdminPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white border rounded">Prev</button>
                <button disabled={(adminPage*adminLimit) >= adminTotal} onClick={() => setAdminPage(p => p+1)} className="px-3 py-1 bg-white border rounded">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marks Results */}
      {studentMarks && (
        <div className="space-y-6">
          {/* Student Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {studentMarks.student.name}
                </h2>
                <p className="text-gray-600">
                  Roll No: {studentMarks.student.rollNumber} | {studentMarks.semester}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {studentMarks.cgpa}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">CGPA</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {calculatePercentage(studentMarks.marks)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Percentage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Subject-wise Marks</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Internal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      External
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentMarks.marks.map((mark, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {mark.subjectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {mark.subjectCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mark.internalMarks}/20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mark.externalMarks}/80
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {mark.totalMarks}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(mark.grade)}`}>
                          {mark.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Marks:</span>
                <span className="text-lg font-bold text-gray-900">
                  {calculateTotalMarks(studentMarks.marks)}/{calculateMaxMarks(studentMarks.marks)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;