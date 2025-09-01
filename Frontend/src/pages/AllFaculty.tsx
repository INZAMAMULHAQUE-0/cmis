import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AllFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/users?role=faculty');
        if (res && res.success) setFaculty(res.data);
      } catch {}
      setLoading(false);
    };
    fetchFaculty();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Faculty</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {faculty.length === 0 ? (
            <div className="text-gray-500">No faculty found.</div>
          ) : (
            faculty.map((fac: any) => (
              <div key={fac._id} className="bg-white p-3 rounded border flex justify-between items-center">
                <div>
                  <div className="font-semibold">{fac.name || fac.email} <span className="text-xs text-gray-500">({fac.email})</span></div>
                  <div className="text-sm text-gray-600">Department: {fac.department || '-'}</div>
                  <div className="text-sm text-gray-600">Role: {fac.role}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllFaculty;
