import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = (user as any)?.role === 'admin';
  const { addToast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', code: '', credits: 3, description: '' });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '', rollNumber: '', department: '' });
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingFaculty, setLoadingFaculty] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/courses');
        if (res && res.success) setCourses(res.data);
        // Fetch all students
        setLoadingStudents(true);
        try {
          const stuRes = await api.get('/api/students');
          if (stuRes && stuRes.success) setStudents(stuRes.data);
        } catch {}
        setLoadingStudents(false);
        // Fetch all faculty
        setLoadingFaculty(true);
        try {
          const facRes = await api.get('/api/users?role=faculty');
          if (facRes && facRes.success) setFaculty(facRes.data);
        } catch {}
        setLoadingFaculty(false);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  const create = async () => {
    try {
      await api.post('/api/courses', { title: form.title, code: form.code, credits: form.credits, description: form.description });
      setShowForm(false);
      const res = await api.get('/api/courses');
      if (res && res.success) setCourses(res.data);
    } catch (e) {
      // noop
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await api.del(`/api/courses/${id}`);
      setCourses(curr => curr.filter(c => c._id !== id));
    } catch (e) {
      // noop
    }
  };

  if (!isAdmin) return <div className="p-6">You do not have permission to view this page.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Manage courses and system data from here.</p>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Courses</h2>
          <div>
      {/* Students List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">All Students</h2>
        {loadingStudents ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {students.length === 0 ? (
              <div className="text-gray-500">No students found.</div>
            ) : (
              students.map((stu: any) => (
                <div key={stu._id} className="bg-white p-3 rounded border flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{stu.name} <span className="text-xs text-gray-500">({stu.rollNumber})</span></div>
                    <div className="text-sm text-gray-600">{stu.department}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Faculty List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">All Faculty</h2>
        {loadingFaculty ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {faculty.length === 0 ? (
              <div className="text-gray-500">No faculty found.</div>
            ) : (
              faculty.map((fac: any) => (
                <div key={fac._id} className="bg-white p-3 rounded border flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{fac.name || fac.email} <span className="text-xs text-gray-500">({fac.email})</span></div>
                    <div className="text-sm text-gray-600">{fac.department || fac.role}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
            <button onClick={() => setShowForm(s => !s)} className="bg-green-600 text-white px-3 py-1 rounded">{showForm ? 'Close' : 'Add Course'}</button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-4 rounded shadow mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border p-2 rounded" />
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Code" className="border p-2 rounded" />
              <input value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} placeholder="Credits" type="number" className="border p-2 rounded" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border p-2 rounded col-span-1 md:col-span-2" />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowForm(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={create} className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Students</h2>
            <div>
              <button onClick={() => setShowStudentForm(s => !s)} className="bg-green-600 text-white px-3 py-1 rounded">{showStudentForm ? 'Close' : 'Add Student'}</button>
            </div>
          </div>

          {showStudentForm && (
            <div className="bg-white p-4 rounded shadow mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="Full Name" className="border p-2 rounded" />
                <input value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} placeholder="Email" className="border p-2 rounded" />
                <input value={studentForm.password} onChange={e => setStudentForm({ ...studentForm, password: e.target.value })} placeholder="Password (leave blank to auto-generate)" className="border p-2 rounded" />
                <input value={studentForm.rollNumber} onChange={e => setStudentForm({ ...studentForm, rollNumber: e.target.value })} placeholder="Roll Number" className="border p-2 rounded" />
                <input value={studentForm.department} onChange={e => setStudentForm({ ...studentForm, department: e.target.value })} placeholder="Department" className="border p-2 rounded" />
                <select value={selectedCourse || ''} onChange={e => setSelectedCourse(e.target.value || null)} className="border p-2 rounded">
                  <option value="">Assign Course (optional)</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input id="sendEmail" type="checkbox" checked={sendWelcomeEmail} disabled={isSendingEmail} onChange={e => setSendWelcomeEmail(e.target.checked)} />
                <label htmlFor="sendEmail" className="text-sm text-gray-700">Send welcome email with credentials</label>
              </div>
              {formErrors && <div className="text-sm text-red-600 mt-2">{formErrors}</div>}
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setShowStudentForm(false)} className="px-3 py-1 border rounded">Cancel</button>
                <button disabled={isSubmitting} onClick={async () => {
                  setIsSubmitting(true);
                  setFormErrors(null);
                  // basic validation
                  if (!studentForm.name || !studentForm.email || !studentForm.rollNumber || !studentForm.department) {
                    setFormErrors('Please fill name, email, roll number and department.');
                    return;
                  }

                  // default password generation
                  const genPassword = () => {
                    const s = Math.random().toString(36).slice(-8) + 'A1!';
                    return s;
                  };
                  const passwordToUse = studentForm.password && studentForm.password.length >= 6 ? studentForm.password : genPassword();

                  try {
                    // 1) create auth user with role student
                    const regRes: any = await api.post('/api/auth/register', { email: studentForm.email, password: passwordToUse, role: 'student' });
                    if (!regRes || !regRes.success) {
                      setFormErrors(regRes?.message || 'Registration failed');
                      return;
                    }

                    // 2) create student profile
                    const payload: any = { name: studentForm.name, rollNumber: studentForm.rollNumber, department: studentForm.department };
                    if (selectedCourse) payload.courses = [selectedCourse];
                    const stuRes: any = await api.post('/api/students', payload);
                    if (!stuRes || !stuRes.success) {
                      setFormErrors(stuRes?.message || 'Failed to create student profile');
                      return;
                    }

                    // success
                    setShowStudentForm(false);
                    setStudentForm({ name: '', email: '', password: '', rollNumber: '', department: '' });
                    setSelectedCourse(null);
                    addToast('success', 'Student created');
                    // optionally: show generated password to admin
                    if (!studentForm.password) addToast('info', `Generated password: ${passwordToUse}`);

                    // send welcome email if requested
                    if (sendWelcomeEmail) {
                      setIsSendingEmail(true);
                      try {
                        const mailRes: any = await api.post('/api/auth/send-welcome', { email: studentForm.email, password: passwordToUse, name: studentForm.name });
                        if (mailRes && mailRes.success) {
                          addToast('success', 'Welcome email sent');
                        } else {
                          addToast('error', mailRes?.message || 'Failed to send welcome email');
                        }
                      } catch (mailErr: any) {
                        addToast('error', mailErr?.message || 'Failed to send welcome email');
                      } finally {
                        setIsSendingEmail(false);
                      }
                    }
                  } catch (err: any) {
                    setFormErrors(err?.message || 'Failed to create student');
                  }
                  setIsSubmitting(false);
                }} className="px-3 py-1 bg-blue-600 text-white rounded">{isSubmitting ? 'Creating...' : 'Create Student'}</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {courses.map(c => (
                <div key={c._id} className="bg-white p-3 rounded border flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{c.title} <span className="text-xs text-gray-500">({c.code})</span></div>
                    <div className="text-sm text-gray-600">{c.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => remove(c._id)} className="px-2 py-1 bg-red-50 text-red-700 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
