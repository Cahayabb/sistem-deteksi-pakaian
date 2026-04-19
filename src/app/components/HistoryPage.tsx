import { ArrowLeft, CheckCircle, XCircle, Search, Calendar } from 'lucide-react';
import { DetectionRecord } from '../types';
import { useState } from 'react';

interface HistoryPageProps {
  records: DetectionRecord[];
  onNavigate: (page: 'dashboard' | 'detection' | 'history') => void;
}

export function HistoryPage({ records, onNavigate }: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'compliant' | 'non-compliant'>('all');

  const filteredRecords = records
    .filter(record => {
      if (filterStatus === 'compliant') return record.isCompliant;
      if (filterStatus === 'non-compliant') return !record.isCompliant;
      return true;
    })
    .filter(record => {
      const searchLower = searchTerm.toLowerCase();
      return (
        record.items.some(item =>
          item.type.toLowerCase().includes(searchLower) ||
          item.color.toLowerCase().includes(searchLower)
        ) ||
        new Date(record.timestamp).toLocaleString('id-ID').includes(searchLower)
      );
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
          <h1>Riwayat Deteksi</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan item atau tanggal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterStatus('compliant')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  filterStatus === 'compliant'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Sesuai SOP
              </button>
              <button
                onClick={() => setFilterStatus('non-compliant')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  filterStatus === 'non-compliant'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Tidak Sesuai
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Menampilkan {filteredRecords.length} dari {records.length} data
          </p>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="mb-2">Tidak Ada Data</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Tidak ada data yang sesuai dengan filter Anda'
                  : 'Belum ada data deteksi. Mulai deteksi pakaian untuk melihat riwayat.'}
              </p>
            </div>
          ) : (
            filteredRecords.map((record, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {record.isCompliant ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${record.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                        {record.isCompliant ? 'SESUAI SOP' : 'TIDAK SESUAI SOP'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(record.timestamp).toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">#{records.length - index}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {record.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`border rounded-lg p-3 ${
                        item.compliant
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{item.type}</span>
                        <span className={`text-xs ${item.compliant ? 'text-green-600' : 'text-red-600'}`}>
                          {item.compliant ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">Warna: {item.color}</p>
                      <p className="text-xs text-gray-700">
                        Confidence: {(item.confidence * 100).toFixed(0)}%
                      </p>
                      {!item.compliant && item.reason && (
                        <p className="text-xs text-red-600 mt-1">{item.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
