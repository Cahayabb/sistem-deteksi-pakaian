import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, ArrowLeft, Shirt, Loader2 } from 'lucide-react';
import { DetectionResult, ClothingItem } from '../types';
import { analyzeClothing } from '../utils/mockAI';

interface DetectionPageProps {
  onNavigate: (page: 'dashboard' | 'detection' | 'history') => void;
  onSaveRecord: (result: DetectionResult) => void;
}

export function DetectionPage({ onNavigate, onSaveRecord }: DetectionPageProps) {
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

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysisResult = analyzeClothing();
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleSave = () => {
    if (result && capturedImage) {
      onSaveRecord(result);
      handleReset();
      alert('Data berhasil disimpan ke riwayat!');
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setMode('select');
  };

  const getItemStatusColor = (item: ClothingItem) => {
    return item.compliant ? 'text-green-600' : 'text-red-600';
  };

  const getItemStatusBg = (item: ClothingItem) => {
    return item.compliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  if (mode === 'select') {
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
            <h1>Deteksi Pakaian SOP</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="mb-4">Pilih Metode Deteksi</h2>
            <p className="text-gray-600">Gunakan kamera atau upload foto untuk mendeteksi kepatuhan SOP pakaian</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('camera')}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="mb-2">Gunakan Kamera</h3>
              <p className="text-gray-600">Ambil foto langsung menggunakan kamera</p>
            </button>

            <button
              onClick={() => {
                setMode('upload');
                fileInputRef.current?.click();
              }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-purple-500"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-2">Upload Foto</h3>
              <p className="text-gray-600">Pilih foto dari perangkat Anda</p>
            </button>
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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1>Kamera Deteksi</h1>
            <button
              onClick={() => setMode('select')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
              Tutup
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
              videoConstraints={{
                facingMode: 'user'
              }}
            />
            <div className="p-6 bg-gray-50 flex justify-center">
              <button
                onClick={handleCapture}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Ambil Foto
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1>Hasil Deteksi</h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4" />
            Tutup
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3>Foto yang Dianalisis</h3>
            </div>
            <img src={capturedImage || ''} alt="Captured" className="w-full" />
          </div>

          {/* Results */}
          <div>
            {isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="mb-2">Menganalisis Pakaian...</h3>
                <p className="text-gray-600">Mohon tunggu sebentar</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Overall Status */}
                <div className={`rounded-xl shadow-lg p-6 ${result.isCompliant ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {result.isCompliant ? (
                      <div className="bg-green-600 p-2 rounded-full">
                        <Shirt className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="bg-red-600 p-2 rounded-full">
                        <Shirt className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <h2 className={result.isCompliant ? 'text-green-900' : 'text-red-900'}>
                      {result.isCompliant ? 'SESUAI SOP' : 'TIDAK SESUAI SOP'}
                    </h2>
                  </div>
                  <p className={result.isCompliant ? 'text-green-700' : 'text-red-700'}>
                    {result.isCompliant
                      ? 'Semua pakaian sesuai dengan standar operasional'
                      : 'Terdapat pakaian yang tidak sesuai standar'}
                  </p>
                </div>

                {/* Detection Details */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="mb-4">Detail Deteksi</h3>
                  <div className="space-y-3">
                    {result.items.map((item, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 ${getItemStatusBg(item)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{item.type}</span>
                          <span className={`text-sm font-medium ${getItemStatusColor(item)}`}>
                            {item.compliant ? '✓ Sesuai' : '✗ Tidak Sesuai'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>Warna: {item.color}</p>
                          <p>Confidence: {(item.confidence * 100).toFixed(0)}%</p>
                          {!item.compliant && item.reason && (
                            <p className="text-red-600 mt-1">Alasan: {item.reason}</p>
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
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Simpan ke Riwayat
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Deteksi Baru
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
