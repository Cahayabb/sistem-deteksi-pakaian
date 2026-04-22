import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, CheckCircle, XCircle, Camera, LogOut, History, Scan, User, TrendingUp, Activity } from 'lucide-react';
import { DetectionRecord } from '../types';

interface DashboardEnhancedProps {
  records: DetectionRecord[];
  onNavigate: (page: 'dashboard' | 'detection' | 'history' | 'profile') => void;
  onLogout: () => void;
  username: string;
}

export function DashboardEnhanced({ records, onNavigate, onLogout, username }: DashboardEnhancedProps) {
  const totalToday = records.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.timestamp).toDateString() === today;
  }).length;

  const compliantToday = records.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.timestamp).toDateString() === today && r.isCompliant;
  }).length;

  const nonCompliantToday = totalToday - compliantToday;

  const complianceRate = totalToday > 0 ? ((compliantToday / totalToday) * 100).toFixed(1) : '0';

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
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      'Sesuai SOP': compliant,
      'Tidak Sesuai': nonCompliant,
      total: dayRecords.length
    };
  });

  const recentDetections = records
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1">Dashboard Monitoring SOP Pakaian</h1>
              <p className="text-sm text-gray-600">Sistem Deteksi Kepatuhan Berpakaian Mahasiswa</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{username}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3 border-b-2 border-indigo-600 text-indigo-600 font-medium bg-indigo-50/50"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => onNavigate('detection')}
              className="px-5 py-3 border-b-2 border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Deteksi Pakaian
              </div>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="px-5 py-3 border-b-2 border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deteksi Hari Ini</p>
                <p className="text-3xl font-bold text-gray-900">{totalToday}</p>
                <p className="text-xs text-gray-500 mt-1">Mahasiswa terdeteksi</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sesuai SOP</p>
                <p className="text-3xl font-bold text-green-600">{compliantToday}</p>
                <p className="text-xs text-gray-500 mt-1">Patuh terhadap SOP</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tidak Sesuai SOP</p>
                <p className="text-3xl font-bold text-red-600">{nonCompliantToday}</p>
                <p className="text-xs text-gray-500 mt-1">Pelanggaran terdeteksi</p>
              </div>
              <div className="bg-red-100 p-4 rounded-xl">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tingkat Kepatuhan</p>
                <p className="text-3xl font-bold text-purple-600">{complianceRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Compliance rate</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Statistik 7 Hari Terakhir</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Sesuai SOP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Tidak Sesuai</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="Sesuai SOP" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Tidak Sesuai" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-3">
              {recentDetections.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">Belum ada aktivitas deteksi</p>
              ) : (
                recentDetections.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${record.isCompliant ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {record.isCompliant ? 'Sesuai SOP' : 'Pelanggaran Terdeteksi'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.timestamp).toLocaleString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                    {record.isCompliant ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="mb-6">Tren Kepatuhan Mingguan</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Sesuai SOP"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="Tidak Sesuai"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="mb-3">Mulai Deteksi Kepatuhan Pakaian</h2>
              <p className="text-indigo-100 mb-4 max-w-2xl">
                Gunakan kamera real-time atau upload gambar untuk mendeteksi kepatuhan SOP berpakaian mahasiswa dengan teknologi AI Computer Vision
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Deteksi Real-time
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Visualisasi Bounding Box
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Analisis Detail
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('detection')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 shrink-0"
            >
              <Camera className="w-6 h-6" />
              <span className="font-medium">Mulai Deteksi</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
