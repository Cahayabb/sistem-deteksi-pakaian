import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DetectionResult } from '../types';
import { analyzeClothing } from '../utils/mockAI';

interface DetectionPageEnhancedProps {
  onNavigate: (page: 'dashboard' | 'detection' | 'history' | 'profile') => void;
  onSaveRecord: (result: DetectionResult) => void;
}

export function DetectionPageEnhanced({ onNavigate, onSaveRecord }: DetectionPageEnhancedProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      analyzeImage(imageSrc);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageSrc = event.target?.result as string;
        setCapturedImage(imageSrc);
        analyzeImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageSrc: string) => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    const analysisResult = analyzeClothing();
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleSave = () => {
    if (result && capturedImage) {
      onSaveRecord(result);
      handleReset();
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setMode('select');
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </button>
            <h1>Deteksi Kepatuhan Pakaian</h1>
            <p className="text-sm text-gray-600 mt-1">Sistem Computer Vision untuk Monitoring SOP Berpakaian Mahasiswa</p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-6">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Powered by AI Computer Vision</span>
            </div>
            <h2 className="mb-4">Pilih Metode Deteksi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistem akan menganalisis atribut pakaian (atasan, bawahan, sepatu) dan memberikan hasil deteksi dengan visualisasi bounding box beserta status kepatuhan SOP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <button
              onClick={() => setMode('camera')}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-3">Kamera Real-Time</h3>
                <p className="text-gray-600 mb-4">Ambil foto langsung menggunakan kamera perangkat untuk deteksi instant</p>
                <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
                  <span>Mulai Deteksi</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setMode('upload');
                fileInputRef.current?.click();
              }}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-purple-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-3">Upload Gambar</h3>
                <p className="text-gray-600 mb-4">Pilih foto dari galeri atau file manager untuk dianalisis sistem</p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                  <span>Pilih File</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </button>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h3 className="mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              SOP Berpakaian Kampus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border">
                <p className="font-medium mb-2">Atasan</p>
                <p className="text-sm text-gray-600">Kemeja berkerah dan tidak berbahan kaos(pria), Kemeja/blus sopan dan lengan minimal 2/3(wanita)</p>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <p className="font-medium mb-2">Bawahan</p>
                <p className="text-sm text-gray-600">Celana panjang atau rok (wanita) bahan(bukan jeans/legging)</p>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <p className="font-medium mb-2">Sepatu</p>
                <p className="text-sm text-gray-600">Tertutup(bukan sandal)</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </main>
      </div>
    );
  }

  if (mode === 'camera' && !capturedImage) {
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-white">Kamera Deteksi Real-Time</h1>
            <button
              onClick={() => setMode('select')}
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Tutup
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
              videoConstraints={{
                facingMode: 'user',
                width: 1280,
                height: 720
              }}
            />
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-4">
              <p className="text-white/80 text-sm">Posisikan subjek di tengah frame untuk hasil optimal</p>
              <button
                onClick={handleCapture}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Camera className="w-6 h-6" />
                <span className="font-medium">Ambil Foto & Analisis</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1>Hasil Analisis Deteksi</h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Deteksi Baru
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isAnalyzing ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Loader2 className="w-24 h-24 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <h2 className="mb-3">Menganalisis Gambar...</h2>
            <p className="text-gray-600 mb-4">Sistem AI sedang mendeteksi atribut pakaian</p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : result && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Image with Bounding Boxes */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h3 className="text-white flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Visualisasi Deteksi
                  </h3>
                </div>
                <div className="relative">
                  <img src={capturedImage || ''} alt="Analyzed" className="w-full" />

                  {/* Simulated Bounding Boxes */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Bounding box untuk Baju (Atasan) */}
                    <rect
                      x="30" y="25" width="40" height="25"
                      fill="none"
                      stroke={result.items[0]?.compliant ? '#10b981' : '#ef4444'}
                      strokeWidth="0.5"
                      strokeDasharray="2,1"
                    />
                    <text x="32" y="23" fontSize="3" fill={result.items[0]?.compliant ? '#10b981' : '#ef4444'} fontWeight="bold">
                      Atasan
                    </text>

                    {/* Bounding box untuk Celana (Bawahan) */}
                    <rect
                      x="32" y="52" width="36" height="35"
                      fill="none"
                      stroke={result.items[1]?.compliant ? '#10b981' : '#ef4444'}
                      strokeWidth="0.5"
                      strokeDasharray="2,1"
                    />
                    <text x="34" y="50" fontSize="3" fill={result.items[1]?.compliant ? '#10b981' : '#ef4444'} fontWeight="bold">
                      Bawahan
                    </text>

                    {/* Bounding box untuk Sepatu */}
                    <rect
                      x="30" y="88" width="40" height="10"
                      fill="none"
                      stroke={result.items[2]?.compliant ? '#10b981' : '#ef4444'}
                      strokeWidth="0.5"
                      strokeDasharray="2,1"
                    />
                    <text x="32" y="86" fontSize="3" fill={result.items[2]?.compliant ? '#10b981' : '#ef4444'} fontWeight="bold">
                      Sepatu
                    </text>
                  </svg>
                </div>
                <div className="p-4 bg-gray-50 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-green-500 inline-block"></span> = Sesuai SOP
                    <span className="w-3 h-3 border-2 border-red-500 inline-block ml-3"></span> = Tidak Sesuai SOP
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Overall Status */}
              <div className={`rounded-2xl shadow-lg p-8 ${
                result.isCompliant
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
              }`}>
                <div className="flex items-start gap-4">
                  {result.isCompliant ? (
                    <div className="bg-green-600 p-3 rounded-full shrink-0">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-600 p-3 rounded-full shrink-0">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className={result.isCompliant ? 'text-green-900 mb-2' : 'text-red-900 mb-2'}>
                      {result.isCompliant ? 'SESUAI SOP' : 'PELANGGARAN TERDETEKSI'}
                    </h2>
                    <p className={result.isCompliant ? 'text-green-700' : 'text-red-700'}>
                      {result.isCompliant
                        ? 'Semua atribut pakaian mahasiswa sesuai dengan standar operasional prosedur kampus'
                        : 'Terdapat atribut pakaian yang tidak sesuai dengan standar operasional prosedur kampus'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detection Details */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gray-50 border-b">
                  <h3 className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                    Detail Hasil Deteksi
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {result.items.map((item, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-xl p-5 transition-all hover:shadow-md ${
                        item.compliant
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.compliant ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="font-bold text-lg capitalize">
                            {item.type === 'baju' ? 'Atasan' : item.type === 'celana' ? 'Bawahan' : 'Sepatu'}
                          </span>
                        </div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          item.compliant
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {item.compliant ? '✓ Sesuai' : '✗ Tidak Sesuai'}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Warna Terdeteksi:</span>
                          <span className="font-medium capitalize">{item.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tingkat Kepercayaan:</span>
                          <span className="font-medium">{(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${item.compliant ? 'bg-green-600' : 'bg-red-600'}`}
                            style={{ width: `${item.confidence * 100}%` }}
                          ></div>
                        </div>

                        {!item.compliant && item.reason && (
                          <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                            <p className="text-xs font-medium text-red-800 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span><strong>Detail Pelanggaran:</strong> {item.reason}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Simpan ke Riwayat
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Deteksi Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
