import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { requestCode } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import Button from "../components/ui/Button";
import { cn } from "../utils/cn";
import { getErrorMessage } from "../utils/apiError";

const RESEND_SECONDS = 60;
const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;

export default function Login() {
  const navigate = useNavigate();
  const { login } = usePortalAuth();

  const [step, setStep] = useState("phone");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const codeInputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const fullPhone = `+998${phoneDigits}`;

  async function handleSendCode(event) {
    event?.preventDefault();
    if (phoneDigits.length !== 9) {
      setError("Telefon raqamini to'liq kiriting");
      return;
    }
    setError("");
    setNotRegistered(false);
    setSubmitting(true);
    try {
      await requestCode(fullPhone);
      setStep("code");
      setCooldown(RESEND_SECONDS);
      setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotRegistered(true);
      } else {
        setError(getErrorMessage(err, "Kod yuborib bo'lmadi"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleCodeChange(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      handleVerify(next.join(""));
    }
  }

  function handleCodeKeyDown(index, event) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify(fullCode) {
    setError("");
    setSubmitting(true);
    try {
      await login(fullPhone, fullCode);
      setStep("success");
      setTimeout(() => navigate("/select-child", { replace: true }), 700);
    } catch (err) {
      setError(getErrorMessage(err, "Kod noto'g'ri"));
      setCode(["", "", "", "", "", ""]);
      codeInputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="Logo" className="mx-auto mb-3 h-12 w-12" />
          <h1 className="text-lg font-semibold text-gray-900">Ota-ona portali</h1>
        </div>

        <div className="relative overflow-hidden rounded-card border border-gray-100 bg-white p-6 shadow-card">
          <div
            className={cn(
              "transition-opacity duration-200",
              step === "phone" ? "opacity-100" : "pointer-events-none absolute inset-6 opacity-0",
            )}
          >
            <h2 className="mb-1 text-base font-semibold text-gray-900">Telefon raqamingiz</h2>
            <p className="mb-4 text-sm text-gray-500">
              Kirish kodi Telegram bot orqali yuboriladi
            </p>
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div className="flex items-center rounded-btn border border-gray-300 px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40">
                <span className="mr-1 text-sm font-medium text-gray-500">+998</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  placeholder="90 123 45 67"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  className="w-full border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              {notRegistered && (
                <div className="rounded-btn bg-accent-light/20 p-3 text-sm text-accent-dark">
                  <p className="mb-2 font-medium">Siz hali ro'yxatdan o'tmagansiz</p>
                  <p className="mb-3 text-xs text-gray-600">
                    Avval Telegram botga o'tib, farzandingiz bilan bog'laning.
                  </p>
                  {BOT_USERNAME && (
                    <a
                      href={`https://t.me/${BOT_USERNAME}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-btn bg-accent px-3 py-2 text-xs font-medium text-accent-dark"
                    >
                      <MessageCircle size={14} />
                      Botga o'tish
                    </a>
                  )}
                </div>
              )}

              {error && !notRegistered && <p className="text-sm text-danger">{error}</p>}

              <Button type="submit" disabled={submitting}>
                <Phone size={16} />
                {submitting ? "Yuborilmoqda..." : "Kod olish"}
              </Button>
            </form>
          </div>

          <div
            className={cn(
              "transition-opacity duration-200",
              step === "code" ? "opacity-100" : "pointer-events-none absolute inset-6 opacity-0",
            )}
          >
            <h2 className="mb-1 text-base font-semibold text-gray-900">Kodni kiriting</h2>
            <p className="mb-4 text-sm text-gray-500">
              Telegram botga yuborilgan 6 xonali kod
            </p>
            <div className="mb-4 flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (codeInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className="h-12 w-11 rounded-btn border border-gray-300 text-center text-lg font-semibold text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/40"
                />
              ))}
            </div>

            {error && <p className="mb-3 text-sm text-danger">{error}</p>}

            <button
              type="button"
              disabled={cooldown > 0 || submitting}
              onClick={handleSendCode}
              className="w-full text-center text-sm font-medium text-accent-dark disabled:text-gray-400"
            >
              {cooldown > 0 ? `Qayta yuborish (${cooldown}s)` : "Kodni qayta yuborish"}
            </button>
          </div>

          <div
            className={cn(
              "flex flex-col items-center gap-2 py-6 text-center transition-opacity duration-200",
              step === "success" ? "opacity-100" : "pointer-events-none absolute inset-6 opacity-0",
            )}
          >
            <CheckCircle2 size={40} className="text-success" />
            <p className="text-sm font-medium text-gray-900">Muvaffaqiyatli kirdingiz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
