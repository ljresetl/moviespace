"use client";
import React, { useState, useCallback, useEffect, FormEvent } from "react";
import { signIn } from "next-auth/react";
import styles from "./AuthModal.module.css";
import { registerUser, resetPassword } from "../../../lib/api";
import { ApiError } from "../../../lib/types";

type AuthMode = "register" | "login" | "forgot";

interface AuthModalProps { isOpen: boolean; onClose: () => void; }
interface FormErrors { email?: string; password?: string; confirm_password?: string; general?: string; }

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const switchMode = useCallback((m: AuthMode) => {
    setMode(m); setErrors({}); setSuccessMessage(null);
    setPassword(""); setConfirmPassword("");
  }, []);

  const handleClose = useCallback(() => {
    setErrors({}); setSuccessMessage(null);
    setPassword(""); setConfirmPassword("");
    onClose();
  }, [onClose]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors = {};
    if (!email.trim()) errs.email = "Email обов'язковий";
    if (password.length < 8) errs.password = "Мінімум 8 символів";
    if (password !== confirmPassword) errs.confirm_password = "Паролі не збігаються";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true); setErrors({});
    try {
      await registerUser(email, password, confirmPassword);
      setSuccessMessage("✅ Реєстрація успішна! Перевірте пошту для активації акаунту.");
      setEmail(""); setPassword(""); setConfirmPassword("");
    } catch (error) {
      if (error instanceof ApiError) setErrors({ general: error.message });
      else setErrors({ general: "Мережева помилка. Перевірте чи запущено бекенд." });
    } finally { setIsLoading(false); }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setErrors({ general: "Заповніть всі поля" }); return; }

    setIsLoading(true); setErrors({});
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setErrors({ general: result.error === "CredentialsSignin" ? "Неправильний email або пароль" : result.error });
      } else if (result?.ok) {
        setSuccessMessage("✅ Вхід успішний!");
        setTimeout(handleClose, 1000);
      }
    } catch {
      setErrors({ general: "Мережева помилка" });
    } finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setErrors({ email: "Введіть ваш email" }); return; }

    setIsLoading(true); setErrors({});
    try {
      await resetPassword(email);
      setSuccessMessage("✅ Лист для відновлення пароля надіслано! Перевірте вашу пошту.");
      setEmail("");
    } catch (error) {
      if (error instanceof ApiError) setErrors({ general: error.message });
      else setErrors({ general: "Мережева помилка" });
    } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const titles: Record<AuthMode, { title: string; subtitle: string }> = {
    login: { title: "Увійти", subtitle: "З поверненням!" },
    register: { title: "Створити акаунт", subtitle: "Твій квиток у світ кіно" },
    forgot: { title: "Відновлення пароля", subtitle: "Введіть email для скидання пароля" },
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} type="button">✕</button>

        <h2 className={styles.modalTitle}>{titles[mode].title}</h2>
        <p className={styles.modalSubTitle}>{titles[mode].subtitle}</p>

        {!isForgot && (
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${!isRegister ? styles.tabActive : ""}`} onClick={() => switchMode("login")} type="button">Вхід</button>
            <button className={`${styles.tab} ${isRegister ? styles.tabActive : ""}`} onClick={() => switchMode("register")} type="button">Реєстрація</button>
          </div>
        )}

        {isForgot && (
          <form onSubmit={handleForgotPassword} noValidate className={styles.registerForm}>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errors.general && <div className={styles.errorMessage}>⚠️ {errors.general}</div>}

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Email</label>
              <input type="email" className={`${styles.inputField} ${errors.email ? styles.inputError : ""}`}
                value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: undefined})); }}
                placeholder="your@email.com" disabled={isLoading} />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            <button type="submit" className={`${styles.wideBtn} ${styles.primaryBtn}`} disabled={isLoading}>
              {isLoading ? "Надсилання..." : "Надіслати лист"}
            </button>

            <button type="button" className={styles.backLink} onClick={() => switchMode("login")}>
              ← Повернутися до входу
            </button>
          </form>
        )}

        {!isForgot && (
          <>
            <form onSubmit={isRegister ? handleRegister : handleLogin} noValidate className={styles.registerForm}>
              {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
              {errors.general && <div className={styles.errorMessage}>⚠️ {errors.general}</div>}

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email</label>
                <input type="email" className={`${styles.inputField} ${errors.email ? styles.inputError : ""}`}
                  value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: undefined})); }}
                  placeholder="your@email.com" disabled={isLoading} />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.fieldLabel}>Пароль</label>
                  {!isRegister && (
                    <button type="button" className={styles.forgotLink} onClick={() => switchMode("forgot")}>
                      Забули пароль?
                    </button>
                  )}
                </div>
                <div className={styles.passwordWrapper}>
                  <input type={showPassword ? "text" : "password"}
                    className={`${styles.inputField} ${styles.passwordInput} ${errors.password ? styles.inputError : ""}`}
                    value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: undefined})); }}
                    placeholder="Мінімум 8 символів" disabled={isLoading} />
                  <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              {isRegister && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Підтвердіть пароль</label>
                  <input type="password" className={`${styles.inputField} ${errors.confirm_password ? styles.inputError : ""}`}
                    value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({...p, confirm_password: undefined})); }}
                    placeholder="Повторіть пароль" disabled={isLoading} />
                  {errors.confirm_password && <span className={styles.fieldError}>{errors.confirm_password}</span>}
                </div>
              )}

              <button type="submit" className={`${styles.wideBtn} ${styles.primaryBtn}`} disabled={isLoading}>
                {isLoading ? (isRegister ? "Реєстрація..." : "Вхід...") : (isRegister ? "Зареєструватися" : "Увійти")}
              </button>
            </form>

            <div className={styles.divider}><span className={styles.dividerText}>або</span></div>

            <div className={styles.socialButtons}>
              <button type="button" className={`${styles.wideBtn} ${styles.secondaryBtn}`}
                onClick={() => signIn("google", { callbackUrl: "/" })}>🌐 Google</button>
              <button type="button" className={`${styles.wideBtn} ${styles.secondaryBtn}`}>✈️ Telegram</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}