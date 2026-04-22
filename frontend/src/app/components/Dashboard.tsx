import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, XCircle, Camera, LogOut, History, Scan } from 'lucide-react';
import { DetectionRecord } from '../types';

interface DashboardProps {
  records: DetectionRecord[];
  onNavigate: (page: 'dashboard' | 'detection' | 'history') => void;
  onLogout: () => void;
  username: string;
}

export function Dashboard({ records, onNavigate, onLogout, username }: DashboardProps) {
  // Calculate statistics
  const totalToday = records.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.timestamp).toDateString() === today;
  }).length;

  const compliantToday = records.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.timestamp).toDateString() === today && r.isCompliant;
  }).length;

  const nonCompliantToday = totalToday - compliantToday;

  // Last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toDateString();

    const dayRecords = records.filter(r => new Date(r.timestamp).toDateString() === dateStr);
    const compliant = dayRecords.filter(r => r.isCompliant).length;
    const nonCompliant = dayRecords.length - compliant;

    return {
      name: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      'Sesuai SOP': compliant,
      'Tidak Sesuai': nonCompliant
    };
  });

  const pieData = [
    { name: 'Sesuai SOP', value: compliantToday, color: '#10b981' },
    { name: 'Tidak Sesuai', value: nonCompliantToday, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1>Dashboard Admin</h1>
            <p className="text-sm text-gray-600">Selamat datang, {username}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-3 border-b-2 border-indigo-600 text-indigo-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('detection')}
              className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Deteksi Pakaian
              </div>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Riwayat
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Hari Ini</p>
                <p className="text-3xl font-bold text-gray-900">{totalToday}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sesuai SOP</p>
                <p className="text-3xl font-bold text-green-600">{compliantToday}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tidak Sesuai SOP</p>
                <p className="text-3xl font-bold text-red-600">{nonCompliantToday}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="mb-6">Statistik 7 Hari Terakhir</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Sesuai SOP" fill="#10b981" />
                <Bar dataKey="Tidak Sesuai" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="mb-6">Distribusi Hari Ini</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2">Mulai Deteksi Pakaian</h2>
              <p className="text-indigo-100">Upload foto atau gunakan kamera untuk mendeteksi kepatuhan SOP</p>
            </div>
            <button
              onClick={() => onNavigate('detection')}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Mulai Deteksi
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
