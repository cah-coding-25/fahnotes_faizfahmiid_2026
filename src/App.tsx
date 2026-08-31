import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ZipUploader } from './components/ZipUploader';
import { AssetExplorer } from './components/AssetExplorer';
import { ConversionSettings } from './components/ConversionSettings';
import { ConversionProgress } from './components/ConversionProgress';
import { ResultPreview } from './components/ResultPreview';
import { HowItWorks } from './components/HowItWorks';
import { PsdSpecsGuide } from './components/PsdSpecsGuide';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

import {
  ConversionConfig,
  ConversionResult,
  ExtractedAsset,
  ProgressState,
  ZipAnalysisResult,
} from './types';
import { DEFAULT_CONFIG } from './utils/presets';
import { parseZipArchive } from './utils/zipParser';
import { convertZipAssetsToPsd } from './utils/psdGenerator';

export default function App() {
  // Mode Gelap / Terang (Dark / Light Mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_preference');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Status Jaringan / Offline
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [darkMode]);

  // Status Alur Konversi
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ZipAnalysisResult | null>(null);
  const [assets, setAssets] = useState<ExtractedAsset[]>([]);
  const [config, setConfig] = useState<ConversionConfig>(DEFAULT_CONFIG);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [progress, setProgress] = useState<ProgressState>({
    stage: 'idle',
    stageName: '',
    currentStep: 0,
    totalSteps: 5,
    percentage: 0,
    details: '',
    logs: [],
  });

  const [result, setResult] = useState<ConversionResult | null>(null);

  // Tangani Pemilihan File ZIP
  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);
    setIsAnalyzing(true);
    setResult(null);

    // Buat nama file output yang bersih
    const cleanZipName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    setConfig((prev) => ({
      ...prev,
      outputFilename: `${cleanZipName}_converted_by_faiz_fahmi_id.psd`,
    }));

    try {
      const parsed = await parseZipArchive(file);
      setAnalysis(parsed);
      setAssets(parsed.supportedImages);

      // Jika ada subfolder, aktifkan opsi preserve_folders secara otomatis
      if (parsed.folders.length > 0) {
        setConfig((prev) => ({ ...prev, groupingMode: 'preserve_folders' }));
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Gagal mengekstrak arsip ZIP.');
      setSelectedFile(null);
      setAnalysis(null);
      setAssets([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Bersihkan File & Reset
  const handleClearFile = () => {
    setSelectedFile(null);
    setAnalysis(null);
    setAssets([]);
    setResult(null);
    setErrorMessage(null);
    setIsConverting(false);
  };

  // Toggle Pemilihan Aset Satuan
  const handleToggleSelectAsset = (id: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  // Pilih / Batalkan Semua Aset
  const handleSelectAll = (select: boolean) => {
    setAssets((prev) => prev.map((a) => ({ ...a, selected: select })));
  };

  // Perbarui Pengaturan Konfigurasi
  const handleUpdateConfig = (newConfig: Partial<ConversionConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Mulai Proses Pembuatan File PSD
  const handleStartConversion = async () => {
    if (assets.filter((a) => a.selected).length === 0) {
      setErrorMessage('Pilih setidaknya satu file gambar untuk dikonversi menjadi dokumen PSD.');
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);

    try {
      const conversionResult = await convertZipAssetsToPsd(assets, config, (p) => {
        setProgress(p);
      });
      setResult(conversionResult);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Gagal membuat dokumen Photoshop PSD.');
    } finally {
      setIsConverting(false);
    }
  };

  const scrollToUpload = () => {
    const el = document.getElementById('converter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedAssetCount = assets.filter((a) => a.selected).length;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* Navbar Atas */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isOffline={isOffline}
      />

      {/* Area Konten Utama */}
      <main className="flex-1">
        {/* Bagian Hero */}
        <Hero onScrollToUpload={scrollToUpload} />

        {/* Studio Konversi Inti */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Jika Hasil Sudah Selesai Dibuat */}
          {result ? (
            <ResultPreview
              result={result}
              onReset={handleClearFile}
              onReconfigure={() => setResult(null)}
            />
          ) : isConverting ? (
            /* Tampilan Progres Berjalan */
            <ConversionProgress progress={progress} />
          ) : (
            /* Tahapan Unggah & Pengaturan */
            <div className="space-y-6">
              {/* Langkah 1: Area Unggah ZIP */}
              <ZipUploader
                selectedFile={selectedFile}
                onFileSelected={handleFileSelected}
                onClearFile={handleClearFile}
                isLoading={isAnalyzing}
                errorMessage={errorMessage}
              />

              {/* Langkah 2 & 3: Penjelajah Aset & Pengaturan Konversi bila ZIP sudah diurai */}
              {analysis && assets.length > 0 && (
                <div className="space-y-6 transition-all duration-300">
                  {/* Penjelajah & Pemilihan Gambar */}
                  <AssetExplorer
                    analysis={analysis}
                    assets={assets}
                    onToggleSelectAsset={handleToggleSelectAsset}
                    onSelectAll={handleSelectAll}
                  />

                  {/* Pengaturan Konversi Dokumen PSD */}
                  <ConversionSettings
                    config={config}
                    onChangeConfig={handleUpdateConfig}
                    onStartConversion={handleStartConversion}
                    selectedAssetCount={selectedAssetCount}
                    totalAssetCount={assets.length}
                    assets={assets}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Bagian Edukasi & Informasi Panduan */}
        <HowItWorks />
        <PsdSpecsGuide />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
