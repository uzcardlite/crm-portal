import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import IconButton from "../components/ui/IconButton";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import { toast } from "../components/ui/Toast";
import { requestPortalCode, verifyPortalCode } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { getErrorMessage } from "../utils/apiError";
import { PHONE_PREFIX, normalizePhoneValue } from "../utils/phone";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

// Label + input + one line of error text — the height is reserved up front so
// showing a validation message never shifts the button.
const FIELD_SLOT_CLASS = "min-h-[86px]";

const NOT_REGISTERED_MESSAGE =
  "Siz hali ro'yxatdan o'tmagansiz — Telegram bot orqali ro'yxatdan o'ting";

function formatCountdown(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function PortalLogin() {
  const { isAuthenticated, login } = usePortalAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-card">
            <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover" />
          </span>
          <h1 className="text-xl font-semibold text-gray-900">Ota-ona kabineti</h1>
          <p className="text-sm text-gray-500">
            Farzandingiz davomati, baholari va to'lovlari
          </p>
        </div>

        <Card padding="p-6">
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-2" noValidate>
              <div className={FIELD_SLOT_CLASS}>
                <Input
                  label="Telefon raqami"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+998901234567"
                  value={phone}
                  onChange={(event) => setPhone(normalizePhoneValue(event.target.value))}
                  error={errors.phone}
                  autoComplete="tel"
                  autoFocus
                />
              </div>
              {/* The cooldown from a previous send is still running when the
                  user steps back to edit the phone — sending again would only
                  come back as a 429. */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting || countingDown}
              >
                {submitting && <Spinner size={16} />}
                {submitting
                  ? "Yuborilmoqda..."
                  : countingDown
                    ? `Qayta yuborish ${formatCountdown(cooldown)}`
                    : "Kod olish"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (code.length === CODE_LENGTH) submitCode(code);
              }}
              className="flex flex-col gap-2"
              noValidate
            >
              <div className="mb-4 flex items-center gap-2">
                <IconButton
                  icon={ArrowLeft}
                  aria-label="Raqamni o'zgartirish"
                  onClick={() => {
                    // The resend countdown deliberately keeps running.
                    setStep("phone");
                    setCode("");
                    setErrors({});
                  }}
                />
                <span className="text-sm text-gray-500">{phone}</span>
              </div>

              <p className="text-sm text-gray-700">
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
                  className="w-full rounded-btn border border-gray-300 px-3 py-3 text-center text-2xl tracking-[0.4em] text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                {errors.code && <p className="mt-1.5 text-xs text-danger">{errors.code}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting || code.length < CODE_LENGTH}
              >
                {submitting && <Spinner size={16} />}
                {submitting ? "Tekshirilmoqda..." : "Kirish"}
              </Button>

              {cooldown > 0 ? (
                <p className="mt-3 w-full text-center text-sm text-gray-400">
                  Qayta yuborish {formatCountdown(cooldown)} dan keyin
                </p>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => sendCode(phone.trim())}
                  className="mt-3 w-full text-center text-sm font-medium text-accent-dark transition-colors disabled:opacity-50"
                >
                  Kodni qayta yuborish
                </button>
              )}
            </form>
          )}
        </Card>

        {step === "phone" && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Tasdiqlash kodi Telegram bot orqali yuboriladi.
          </p>
        )}
      </div>
    </div>
  );
}
