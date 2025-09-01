import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AllStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/users?role=student');
        if (res && res.success) setStudents(res.data);
      } catch {}
      setLoading(false);
    };
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {students.length === 0 ? (
            <div className="text-gray-500">No students found.</div>
          ) : (
            students.map((stu: any) => (
              <div key={stu._id} className="bg-white p-3 rounded border flex justify-between items-center">
                <div>
                  <div className="font-semibold">{stu.name || stu.email} <span className="text-xs text-gray-500">({stu.email})</span></div>
                  <div className="text-sm text-gray-600">Department: {stu.department || '-'}</div>
                  <div className="text-sm text-gray-600">Role: {stu.role}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllStudents;
