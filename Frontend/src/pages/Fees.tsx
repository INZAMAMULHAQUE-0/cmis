import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Fee } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Fees: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>('All');

  // Mock data for fees
  const mockFees: Fee[] = [
    {
      id: '1',
      studentId: 'CS2021001',
      studentName: 'John Doe',
      rollNumber: 'CS2021001',
      totalFees: 50000,
      paidAmount: 50000,
      balanceAmount: 0,
      dueDate: '2024-01-15',
      paymentStatus: 'Paid',
      semester: 'Fall 2024'
    },
    {
      id: '2',
      studentId: 'CS2021001',
      studentName: 'John Doe',
      rollNumber: 'CS2021001',
      totalFees: 52000,
      paidAmount: 30000,
      balanceAmount: 22000,
      dueDate: '2024-06-15',
      paymentStatus: 'Partial',
      semester: 'Spring 2024'
    },
    {
      id: '3',
      studentId: 'CS2021001',
      studentName: 'John Doe',
      rollNumber: 'CS2021001',
      totalFees: 55000,
      paidAmount: 0,
      balanceAmount: 55000,
      dueDate: '2024-12-15',
      paymentStatus: 'Pending',
      semester: 'Fall 2025'
    },
    {
      id: '4',
      studentId: 'CS2021002',
      studentName: 'Jane Smith',
      rollNumber: 'CS2021002',
      totalFees: 50000,
      paidAmount: 50000,
      balanceAmount: 0,
      dueDate: '2024-01-15',
      paymentStatus: 'Paid',
      semester: 'Fall 2024'
    },
    {
      id: '5',
      studentId: 'CS2021002',
      studentName: 'Jane Smith',
      rollNumber: 'CS2021002',
      totalFees: 52000,
      paidAmount: 52000,
      balanceAmount: 0,
      dueDate: '2024-06-15',
      paymentStatus: 'Paid',
      semester: 'Spring 2024'
    }
  ];

  const { user } = useAuth();
  const isAdmin = (user as any)?.role === 'admin';
  const [adminPage, setAdminPage] = useState<number>(1);
  const [adminLimit, setAdminLimit] = useState<number>(20);
  const [adminTotal, setAdminTotal] = useState<number>(0);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const localUser = localStorage.getItem('cmis_user');
        const userId = (user && (user as any).id) || (localUser ? JSON.parse(localUser).id : null);
        if (isAdmin) {
          const qs = [`page=${adminPage}`, `limit=${adminLimit}`];
          if (selectedSemester && selectedSemester !== 'All') qs.push(`semester=${encodeURIComponent(selectedSemester)}`);
          const qstr = qs.length ? `?${qs.join('&')}` : '';
          const res = await api.get(`/api/fees${qstr}`);
          if (res && res.success && res.data && Array.isArray(res.data.items)) {
            // map server items to Fee[] shape used by component
            const mapped = res.data.items.map((it: any, idx: number) => ({
              id: `${it.studentId}-${idx}`,
              studentId: it.studentId,
              studentName: it.studentName,
              rollNumber: it.rollNumber,
              totalFees: it.totalFees,
              paidAmount: it.paidAmount,
              balanceAmount: it.balanceAmount,
              dueDate: it.dueDate || '',
              paymentStatus: it.paymentStatus,
              semester: 'All'
            }));
            setFees(mapped);
            setAdminTotal(res.data.total || 0);
          } else {
            setFees([]);
            setAdminTotal(0);
          }
          setIsLoading(false);
          return;
        }

        if (!userId) {
          setFees(mockFees);
          setIsLoading(false);
          return;
        }

        const res = await api.get(`/api/fees/${encodeURIComponent(userId)}`);
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFees(res.data);
        } else if (res && res.success && res.data) {
          // server may return single object
          setFees(Array.isArray(res.data) ? res.data : [res.data]);
        } else {
          // Defensive: only show mock fees that belong to this user (by id or rollNumber)
          const targetId = (user as any)?.id || (user as any)?.rollNumber || null;
          if (targetId) {
            setFees(mockFees.filter(f => f.studentId === targetId));
          } else {
            // fallback to empty to avoid exposing other students' data
            setFees([]);
          }
        }
      } catch (err) {
        const targetId = (user as any)?.id || (user as any)?.rollNumber || null;
        if (targetId) {
          setFees(mockFees.filter(f => f.studentId === targetId));
        } else {
          setFees([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFees();
  }, [user]);

  const getStatusIcon = (status: Fee['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Partial':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Pending':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Fee['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const semesters = ['All', ...Array.from(new Set(fees.map(fee => fee.semester)))];

  const filteredFees = selectedSemester === 'All'
    ? fees
    : fees.filter(fee => fee.semester === selectedSemester);

  // Calculate summary statistics
  const totalFeesAmount = filteredFees.reduce((sum, fee) => sum + fee.totalFees, 0);
  const totalPaidAmount = filteredFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalBalanceAmount = filteredFees.reduce((sum, fee) => sum + fee.balanceAmount, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your fee payments, outstanding balances, and payment history across all semesters.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFeesAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaidAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance Due</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalBalanceAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {semesters.map(semester => (
          <button
            key={semester}
            onClick={() => setSelectedSemester(semester)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedSemester === semester
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {semester}
          </button>
        ))}
      </div>

      {/* Fee Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Fee Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {fee.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fee.rollNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fee.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(fee.totalFees)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(fee.paidAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {formatCurrency(fee.balanceAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(fee.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(fee.paymentStatus)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.paymentStatus)}`}>
                        {fee.paymentStatus}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isAdmin && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {(adminPage-1)*adminLimit + 1} - {Math.min(adminPage*adminLimit, adminTotal)} of {adminTotal}</div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Page size</label>
              <select value={adminLimit} onChange={(e) => { setAdminLimit(Number(e.target.value)); setAdminPage(1); }} className="border rounded px-2 py-1">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <button disabled={adminPage<=1} onClick={() => setAdminPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white border rounded">Prev</button>
              <button disabled={(adminPage*adminLimit) >= adminTotal} onClick={() => setAdminPage(p => p+1)} className="px-3 py-1 bg-white border rounded">Next</button>
            </div>
          </div>
        )}
      </div>

      {filteredFees.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No fee records found for the selected semester.</p>
        </div>
      )}
    </div>
  );
};

export default Fees;