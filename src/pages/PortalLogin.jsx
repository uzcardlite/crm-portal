import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "../components/ui/Toast";
import { requestPortalCode, verifyPortalCode } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { getErrorMessage } from "../utils/apiError";
import { PHONE_PREFIX, normalizePhoneValue } from "../utils/phone";
import { cn } from "../utils/cn";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

// Label + input + one line of error text — the height is reserved up front so
// showing a validation message never shifts the button.
const FIELD_SLOT_CLASS = "min-h-[70px]";

const NOT_REGISTERED_MESSAGE =
  "Siz hali ro'yxatdan o'tmagansiz — Telegram bot orqali ro'yxatdan o'ting";

function formatCountdown(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function PortalLogin() {
  const { isAuthenticated, loading, login, telegramAuthError, clearTelegramAuthError } =
    usePortalAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Surfaces the reason a Telegram Mini App auto-login could not sign the
  // parent in (e.g. not registered yet) once the fallback form appears.
  useEffect(() => {
    if (telegramAuthError) {
      toast.error(telegramAuthError);
      clearTelegramAuthError();
    }
  }, [telegramAuthError, clearTelegramAuthError]);

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  // Guards the auto-submit so one typed code is verified exactly once.
  const verifyingRef = useRef(false);

  const countingDown = cooldown > 0;
  useEffect(() => {
    if (!countingDown) return undefined;
    const timer = setInterval(() => {
      setCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countingDown]);

  const sendCode = useCallback(
    async (targetPhone) => {
      if (submitting) return false;
      setSubmitting(true);
      try {
        await requestPortalCode(targetPhone);
        setCooldown(RESEND_SECONDS);
        toast.success("Tasdiqlash kodi Telegram botingizga yuborildi");
        return true;
      } catch (error) {
        const status = error?.response?.status;
        if (status === 404) {
          toast.error(NOT_REGISTERED_MESSAGE);
        } else {
          toast.error(getErrorMessage(error));
        }
        // The server is already counting a cooldown — mirror it locally so the
        // resend link cannot be hammered.
        if (status === 429) setCooldown(RESEND_SECONDS);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting],
  );

  async function handlePhoneSubmit(event) {
    event.preventDefault();
    if (phone.replace(PHONE_PREFIX, "").length < 9) {
      setErrors({ phone: "Telefon raqamini to'liq kiriting" });
      return;
    }
    setErrors({});
    const sent = await sendCode(phone.trim());
    if (sent) {
      setCode("");
      setStep("code");
    }
  }

  const submitCode = useCallback(
    async (value) => {
      if (verifyingRef.current) return;
      verifyingRef.current = true;
      setSubmitting(true);
      try {
        const tokens = await verifyPortalCode(phone.trim(), value);
        await login(tokens, phone.trim());
        const requestedPath = location.state?.from?.pathname;
        const destination =
          requestedPath && requestedPath !== "/login" ? requestedPath : "/";
        navigate(destination, { replace: true });
      } catch (error) {
        setCode("");
        if (error?.response?.status === 400) {
          setErrors({ code: "Kod noto'g'ri yoki muddati o'tgan" });
        } else {
          toast.error(getErrorMessage(error));
        }
      } finally {
        verifyingRef.current = false;
        setSubmitting(false);
      }
    },
    [phone, login, location.state, navigate],
  );

  // Auto-submit on the sixth digit — one less tap on a phone keyboard.
  useEffect(() => {
    if (step === "code" && code.length === CODE_LENGTH) {
      submitCode(code);
    }
  }, [code, step, submitCode]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // While a Mini App auto-login attempt is in flight, hide the form so the
  // parent never sees it flash before landing on the dashboard.
  if (loading) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center bg-bg">
        <span aria-hidden="true" className="layer-grid" />
        <span aria-hidden="true" className="layer-glow" />
        <span className="relative h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-carrot-bright" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-bg px-5">
      <span aria-hidden="true" className="layer-grid" />
      <span aria-hidden="true" className="layer-glow" />

      <div className="relative z-[5] w-full max-w-[340px]">
        <div className="mb-7 flex flex-col items-center gap-2 text-center">
          <span className="grid h-[62px] w-[62px] place-items-center rounded-full border border-carrot/[.4]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3l8 4v5c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V7l8-4z" stroke="#D79A3C" strokeWidth="1.4" />
              <path d="M9 12.3l2 2 4-4.3" stroke="#D79A3C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
          <h1 className="font-display text-[22px] font-bold italic tracking-tight text-ink">
            Farzandim
          </h1>
          <p className="max-w-[26ch] text-[11px] font-semibold leading-relaxed text-ink-faint">
            Farzandingiz davomati, baholari va to'lovlari — bitta joyda
          </p>
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-3" noValidate>
              <div className={FIELD_SLOT_CLASS}>
                <label htmlFor="phone" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.06em] text-ink-faint">
                  Telefon raqami
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+998901234567"
                  value={phone}
                  onChange={(event) => setPhone(normalizePhoneValue(event.target.value))}
                  autoComplete="tel"
                  autoFocus
                  aria-invalid={errors.phone ? true : undefined}
                  className={cn(
                    "w-full rounded-btn border bg-black/[.24] px-3.5 py-3 text-[13px] font-semibold text-ink outline-none placeholder:text-ink-faint",
                    errors.phone ? "border-rose" : "border-line focus:border-carrot/50",
                  )}
                />
                {errors.phone && <p className="mt-1.5 text-[10px] font-semibold text-rose">{errors.phone}</p>}
              </div>

              {/* The cooldown from a previous send is still running when the
                  user steps back to edit the phone — sending again would only
                  come back as a 429. */}
              <button
                type="submit"
                disabled={submitting || countingDown}
                className="flex w-full items-center justify-center gap-2 rounded-btn bg-carrot-grad py-3 text-[12.5px] font-extrabold text-[#2A1206] shadow-glow transition-opacity disabled:opacity-50"
              >
                {submitting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2A1206]/30 border-t-[#2A1206]" />
                )}
                {submitting
                  ? "Yuborilmoqda..."
                  : countingDown
                    ? `Qayta yuborish ${formatCountdown(cooldown)}`
                    : "Kod olish"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (code.length === CODE_LENGTH) submitCode(code);
              }}
              className="flex flex-col gap-3"
              noValidate
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Raqamni o'zgartirish"
                  onClick={() => {
                    // The resend countdown deliberately keeps running.
                    setStep("phone");
                    setCode("");
                    setErrors({});
                  }}
                  className="grid h-7 w-7 flex-none place-items-center rounded-btn border border-line bg-black/[.24] text-ink-soft"
                >
                  <ArrowLeft size={13} strokeWidth={2.4} />
                </button>
                <span className="text-[11px] font-bold text-ink-soft tnum">{phone}</span>
              </div>

              <p className="text-[11px] font-semibold text-ink-soft">
                Telegramga yuborilgan 6 xonali kodni kiriting
              </p>

              <div className={FIELD_SLOT_CLASS}>
                <input
                  name="code"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))
                  }
                  inputMode="numeric"
                  maxLength={CODE_LENGTH}
                  autoComplete="one-time-code"
                  autoFocus
                  aria-label="Tasdiqlash kodi"
                  aria-invalid={errors.code ? true : undefined}
                  className={cn(
                    "w-full rounded-btn border bg-black/[.24] px-3 py-3 text-center font-display text-[22px] font-bold tracking-[0.35em] text-ink outline-none",
                    errors.code ? "border-rose" : "border-line focus:border-carrot/50",
                  )}
                />
                {errors.code && <p className="mt-1.5 text-[10px] font-semibold text-rose">{errors.code}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting || code.length < CODE_LENGTH}
                className="flex w-full items-center justify-center gap-2 rounded-btn bg-carrot-grad py-3 text-[12.5px] font-extrabold text-[#2A1206] shadow-glow transition-opacity disabled:opacity-50"
              >
                {submitting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2A1206]/30 border-t-[#2A1206]" />
                )}
                {submitting ? "Tekshirilmoqda..." : "Kirish"}
              </button>

              {cooldown > 0 ? (
                <p className="text-center text-[10.5px] font-semibold text-ink-faint">
                  Qayta yuborish {formatCountdown(cooldown)} dan keyin
                </p>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => sendCode(phone.trim())}
                  className="text-center text-[10.5px] font-bold text-carrot-bright transition-opacity disabled:opacity-50"
                >
                  Kodni qayta yuborish
                </button>
              )}
            </form>
          )}
        </div>

        {step === "phone" && (
          <p className="mt-3 text-center text-[9.5px] font-semibold text-ink-faint">
            Tasdiqlash kodi Telegram bot orqali yuboriladi.
          </p>
        )}
      </div>
    </div>
  );
}
