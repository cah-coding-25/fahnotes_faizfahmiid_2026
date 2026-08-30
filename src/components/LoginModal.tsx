import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onShowToast,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = onLogin(username.trim(), password.trim());
    if (success) {
      onShowToast('Login Admin Berhasil!', 'success');
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setErrorMsg('Username atau password salah!');
      onShowToast('Login gagal! Periksa username & password.', 'error');
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="nb-box w-full max-w-sm p-5 bg-white text-black relative shadow-[6px_6px_0px_#000]">
        <button
          onClick={handleClose}
          className="nb-btn absolute top-3.5 right-3.5 p-1 text-xs bg-white text-black hover:bg-[#FAF5EE]"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#FFD233] border-2 border-black flex items-center justify-center font-black text-black shadow-[2px_2px_0px_#000]">
            <Lock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-black">Login Mode Admin</h3>
            <p className="text-xs font-bold text-black/60">Kelola catatan &amp; database</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2 mb-3 rounded-lg bg-[#FFE4E6] border-2 border-black text-[#9F1239] text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Username</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="nb-input w-full px-3 py-2 text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="nb-input w-full px-3 py-2 pr-8 text-xs font-bold text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black w-full py-2.5 text-xs font-black shadow-[3px_3px_0px_#000]"
            >
              Masuk sebagai Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
