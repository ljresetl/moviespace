"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Settings, LogOut, Bookmark, History, Camera, Loader2, Check, AlertCircle } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { uk } from 'date-fns/locale/uk';
import 'react-datepicker/dist/react-datepicker.css';
import { getCurrentUser, patchProfile, changePassword } from '../../../lib/api';
import { ApiError } from '../../../lib/types';
import type { UserProfile, ExtendedSession, ProfileUpdateData } from '../../../lib/types';
import styles from './page.module.css';

registerLocale('uk', uk);

type Tab = 'favorites' | 'history' | 'settings';

function parseDDMMYYYY(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}

function formatToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function ProfilePage() {
  const { data: sessionData, status, update: updateSession } = useSession();
  const session = sessionData as ExtendedSession | null;
  const [activeTab, setActiveTab] = useState<Tab>('favorites');

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileFormError, setProfileFormError] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const accessToken = session?.accessToken;
      if (!accessToken) return;

      // Якщо refresh не вдався — розлогін
      if (session?.error === 'RefreshAccessTokenError') {
        await signOut({ callbackUrl: '/' });
        return;
      }

      try {
        setProfileLoading(true);
        const data = await getCurrentUser(accessToken);
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone || '');
        setBirthdayDate(data.birthday ? parseDDMMYYYY(data.birthday) : null);
        setProfileError(null);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          // Спробуємо оновити сесію
          const refreshed = await updateSession();
          if (refreshed) {
            // Сесія оновлена — перезавантажимо сторінку
            window.location.reload();
            return;
          }
          // Refresh не допоміг — розлогін
          await signOut({ callbackUrl: '/' });
          return;
        }
        if (error instanceof ApiError) {
          setProfileError(error.message);
        } else {
          setProfileError('Не вдалося завантажити профіль');
        }
      } finally {
        setProfileLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadProfile();
    }
  }, [session?.accessToken, session?.error, status, updateSession]);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = session?.accessToken;
    if (!accessToken || !profile) return;

    setProfileSaving(true);
    setProfileSuccess(null);
    setProfileFormError(null);

    try {
      const updateData: ProfileUpdateData = {
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        birthday: birthdayDate ? formatToDDMMYYYY(birthdayDate) : null,
      };

      const updated = await patchProfile(profile.id, updateData, accessToken);
      setProfile(updated);
      setProfileSuccess('✅ Профіль оновлено!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await signOut({ callbackUrl: '/' });
        return;
      }
      if (error instanceof ApiError) {
        setProfileFormError(error.message);
      } else {
        setProfileFormError('Помилка збереження');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = session?.accessToken;
    if (!accessToken) return;

    if (newPassword.length < 8) {
      setPasswordError('Новий пароль — мінімум 8 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Паролі не збігаються');
      return;
    }

    setPasswordSaving(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      await changePassword(oldPassword, newPassword, confirmPassword, accessToken);
      setPasswordSuccess('✅ Пароль змінено!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await signOut({ callbackUrl: '/' });
        return;
      }
      if (error instanceof ApiError) {
        setPasswordError(error.message);
      } else {
        setPasswordError('Помилка зміни пароля');
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.spinner} size={48} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className={styles.errorContainer}>
        <div className="container">
          <h2>Будь ласка, увійдіть в акаунт, щоб переглянути профіль</h2>
          <button onClick={() => window.location.href = '/'} className={styles.actionBtn}>
            На головну
          </button>
        </div>
      </div>
    );
  }

  const userEmail = session.user?.email ?? '';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
    : userEmail;

  return (
    <div className={styles.profileScreen}>
      <div className="container">
        <div className={styles.layout}>

          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatarWrapper}>
                {session.user?.image ? (
                  <img src={session.user.image} alt="Профіль" className={styles.avatar} />
                ) : (
                  <div className={styles.avatarInitial}>{userInitial}</div>
                )}
                <button className={styles.editAvatar} title="Змінити фото">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className={styles.userName}>{displayName}</h2>
              <p className={styles.userEmail}>{userEmail}</p>

              <div className={styles.navGroup}>
                <button className={`${styles.navLink} ${activeTab === 'favorites' ? styles.active : ''}`}
                  onClick={() => setActiveTab('favorites')}>
                  <Bookmark size={20} /> <span>Обране</span>
                </button>
                <button className={`${styles.navLink} ${activeTab === 'history' ? styles.active : ''}`}
                  onClick={() => setActiveTab('history')}>
                  <History size={20} /> <span>Історія</span>
                </button>
                <button className={`${styles.navLink} ${activeTab === 'settings' ? styles.active : ''}`}
                  onClick={() => setActiveTab('settings')}>
                  <Settings size={20} /> <span>Налаштування</span>
                </button>
                <div className={styles.divider}></div>
                <button className={`${styles.navLink} ${styles.logoutBtn}`}
                  onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut size={20} /> <span>Вийти</span>
                </button>
              </div>
            </div>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.contentCard}>
              <h1 className={styles.tabTitle}>
                {activeTab === 'favorites' && 'Моє обране'}
                {activeTab === 'history' && 'Історія переглядів'}
                {activeTab === 'settings' && 'Керування профілем'}
              </h1>

              <div className={styles.tabView}>
                {activeTab === 'favorites' && (
                  <div className={styles.emptyContent}>
                    <Bookmark size={64} strokeWidth={1} />
                    <h3>Тут поки пусто</h3>
                    <p>Додавайте фільми в обране, щоб вони з&#39;явилися тут</p>
                    <button className={styles.actionBtn}>Перейти до каталогу</button>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className={styles.emptyContent}>
                    <History size={64} strokeWidth={1} />
                    <h3>Ви ще нічого не дивилися</h3>
                    <p>Ваші переглянуті фільми будуть зберігатися тут</p>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className={styles.settingsContainer}>
                    {profileLoading && (
                      <div className={styles.loadingRow}>
                        <Loader2 className={styles.spinnerSmall} size={20} />
                        <span>Завантаження даних...</span>
                      </div>
                    )}

                    {profileError && (
                      <div className={styles.errorBanner}><AlertCircle size={18} /> {profileError}</div>
                    )}

                    {!profileLoading && !profileError && (
                      <>
                        <h3 className={styles.sectionTitle}>Особисті дані</h3>
                        {profileSuccess && <div className={styles.successBanner}><Check size={18} /> {profileSuccess}</div>}
                        {profileFormError && <div className={styles.errorBanner}><AlertCircle size={18} /> {profileFormError}</div>}

                        <form className={styles.form} onSubmit={handleSaveProfile}>
                          <div className={styles.formRow}>
                            <div className={styles.field}>
                              <label>Ім&#39;я</label>
                              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ваше ім'я" className={styles.input} />
                            </div>
                            <div className={styles.field}>
                              <label>Прізвище</label>
                              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                                placeholder="Ваше прізвище" className={styles.input} />
                            </div>
                          </div>

                          <div className={styles.field}>
                            <label>Email (не можна змінити)</label>
                            <input type="email" value={userEmail} className={styles.input} disabled />
                          </div>

                          <div className={styles.formRow}>
                            <div className={styles.field}>
                              <label>Телефон</label>
                              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                placeholder="+380..." className={styles.input} maxLength={15} />
                            </div>
                            <div className={styles.field}>
                              <label>Дата народження</label>
                              <DatePicker
                                selected={birthdayDate}
                                onChange={(date: Date | null) => setBirthdayDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Оберіть дату"
                                className={styles.input}
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                yearDropdownItemNumber={100}
                                scrollableYearDropdown
                                maxDate={new Date()}
                                minDate={new Date(1920, 0, 1)}
                                calendarClassName={styles.calendar}
                                wrapperClassName={styles.datePickerWrapper}
                                locale="uk"
                              />
                            </div>
                          </div>

                          <button type="submit" className={styles.submitBtn} disabled={profileSaving}>
                            {profileSaving ? 'Збереження...' : 'Зберегти зміни'}
                          </button>
                        </form>

                        <div className={styles.dividerHorizontal}></div>
                        <h3 className={styles.sectionTitle}>Змінити пароль</h3>
                        {passwordSuccess && <div className={styles.successBanner}><Check size={18} /> {passwordSuccess}</div>}
                        {passwordError && <div className={styles.errorBanner}><AlertCircle size={18} /> {passwordError}</div>}

                        <form className={styles.form} onSubmit={handleChangePassword}>
                          <div className={styles.field}>
                            <label>Поточний пароль</label>
                            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Введіть поточний пароль" className={styles.input} />
                          </div>
                          <div className={styles.formRow}>
                            <div className={styles.field}>
                              <label>Новий пароль</label>
                              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Мінімум 8 символів" className={styles.input} />
                            </div>
                            <div className={styles.field}>
                              <label>Підтвердіть пароль</label>
                              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Повторіть пароль" className={styles.input} />
                            </div>
                          </div>
                          <button type="submit" className={styles.submitBtnAlt} disabled={passwordSaving}>
                            {passwordSaving ? 'Збереження...' : 'Змінити пароль'}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}