import {
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  FileText,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { hiredInApi, type NotificationRead } from "../services/hiredInApi";
import { NotificationType, UserRole } from "../services/hiredInTypes";

export default function NotificationsView() {
  const { isAuthenticated, role } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await hiredInApi.getMyNotifications();
      setNotifications(data ?? []);
      setMessage(data?.length ? "" : "Сповіщень поки немає.");
    } catch {
      setNotifications([]);
      setMessage("Не вдалося завантажити сповіщення. Перевір, чи ти увійшов в акаунт.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !getIsRead(item)).length,
    [notifications],
  );

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !getIsRead(item));
    }

    return notifications;
  }, [filter, notifications]);

  if (!isAuthenticated) {
    return <Navigate to="/candidateLogin" replace />;
  }

  async function handleMarkAsRead(notification: NotificationRead) {
    if (getIsRead(notification)) return;

    try {
      await hiredInApi.markNotificationAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true, IsRead: true } : item,
        ),
      );
    } catch {
      setMessage("Не вдалося позначити сповіщення прочитаним.");
    }
  }

  async function handleMarkAllAsRead() {
    if (!unreadCount) return;

    try {
      await hiredInApi.markAllNotificationsAsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true, IsRead: true })),
      );
      setMessage("");
    } catch {
      setMessage("Не вдалося позначити всі сповіщення прочитаними.");
    }
  }

  async function handleDelete(notificationId: string) {
    try {
      await hiredInApi.deleteNotification(notificationId);
      setNotifications((current) => current.filter((item) => item.id !== notificationId));
    } catch {
      setMessage("Не вдалося видалити сповіщення.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[960px] px-4 py-10 sm:px-8 lg:px-[80px]">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-300">
              <Bell className="h-4 w-4" />
              Сповіщення
            </p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Твої сповіщення
            </h1>
            <p className="mt-2 text-sm text-[#8EA0BA]">
              {isLoading
                ? "Завантажуємо..."
                : unreadCount
                  ? `${unreadCount} непрочитаних · ${notifications.length} всього`
                  : `${notifications.length} сповіщень`}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void handleMarkAllAsRead()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#1E3151] bg-[#0F1D36] px-5 text-sm font-semibold text-[#D7E1EF] transition-colors hover:bg-[#172842]"
            >
              <CheckCheck className="h-4 w-4" />
              Прочитати всі
            </button>
          )}
        </section>

        <div className="mt-6 flex gap-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={`Всі (${notifications.length})`}
          />
          <FilterButton
            active={filter === "unread"}
            onClick={() => setFilter("unread")}
            label={`Непрочитані (${unreadCount})`}
          />
        </div>

        {message && !isLoading && (
          <div className="mt-6 rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 py-3 text-sm text-[#A8B6CD]">
            {message}
          </div>
        )}

        <section className="mt-6 space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] px-6 py-14 text-center text-sm text-[#8EA0BA]">
              Завантаження сповіщень...
            </div>
          ) : visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification) => {
              const isRead = getIsRead(notification);
              const type = getNotificationType(notification);
              const actionLink = getNotificationLink(type, role);

              return (
                <article
                  key={notification.id}
                  className={`rounded-2xl border p-5 transition-colors ${
                    isRead
                      ? "border-[#1E3151] bg-[#0F1D36]/70"
                      : "border-blue-500/30 bg-[#0F1D36]"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${getTypeTone(type)}`}
                    >
                      {getTypeIcon(type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-white">
                              {getTitle(notification)}
                            </h2>
                            {!isRead && (
                              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                Нове
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-[#8EA0BA]">
                            {getText(notification)}
                          </p>
                          <p className="mt-2 text-xs text-[#6B7D99]">
                            {formatDate(notification.createdAtUtc ?? notification.CreatedAtUtc)} ·{" "}
                            {getTypeLabel(type)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleDelete(notification.id)}
                          aria-label="Видалити сповіщення"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#6B7D99] transition-colors hover:bg-[#172842] hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {actionLink && (
                          <Link
                            to={actionLink}
                            onClick={() => void handleMarkAsRead(notification)}
                            className="inline-flex h-9 items-center rounded-lg bg-[#3B82F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB]"
                          >
                            Перейти
                          </Link>
                        )}
                        {!isRead && (
                          <button
                            type="button"
                            onClick={() => void handleMarkAsRead(notification)}
                            className="inline-flex h-9 items-center rounded-lg border border-[#1E3151] px-4 text-sm font-semibold text-[#D7E1EF] transition-colors hover:bg-[#172842]"
                          >
                            Позначити прочитаним
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[#1E3151] bg-[#0F1D36] px-6 py-14 text-center">
              <Bell className="mx-auto h-10 w-10 text-[#3B82F6]" />
              <p className="mt-4 text-sm font-semibold text-[#D7E1EF]">
                {filter === "unread"
                  ? "Непрочитаних сповіщень немає"
                  : "Сповіщень поки немає"}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-[#3B82F6] text-white"
          : "border border-[#1E3151] text-[#8EA0BA] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function getIsRead(notification: NotificationRead) {
  return Boolean(notification.isRead ?? notification.IsRead);
}

function getNotificationType(notification: NotificationRead) {
  return Number(notification.type ?? notification.Type ?? 0);
}

function getTitle(notification: NotificationRead) {
  return notification.title ?? notification.Title ?? "Сповіщення";
}

function getText(notification: NotificationRead) {
  return notification.text ?? notification.Text ?? "";
}

function getTypeLabel(type: number) {
  switch (type) {
    case NotificationType.NewApplication:
      return "Нова заявка";
    case NotificationType.ApplicationStatusChanged:
      return "Статус заявки";
    case NotificationType.NewMessage:
      return "Повідомлення";
    case NotificationType.VacancyApproved:
      return "Вакансію схвалено";
    case NotificationType.VacancyRejected:
      return "Вакансію відхилено";
    default:
      return "Подія";
  }
}

function getTypeTone(type: number) {
  switch (type) {
    case NotificationType.NewApplication:
      return "bg-blue-500/15 text-[#60A5FA]";
    case NotificationType.ApplicationStatusChanged:
      return "bg-amber-500/15 text-amber-300";
    case NotificationType.NewMessage:
      return "bg-violet-500/15 text-violet-300";
    case NotificationType.VacancyApproved:
      return "bg-emerald-500/15 text-emerald-300";
    case NotificationType.VacancyRejected:
      return "bg-red-500/15 text-red-300";
    default:
      return "bg-[#1E3151] text-[#8EA0BA]";
  }
}

function getTypeIcon(type: number) {
  switch (type) {
    case NotificationType.NewApplication:
      return <FileText className="h-5 w-5" />;
    case NotificationType.ApplicationStatusChanged:
      return <BriefcaseBusiness className="h-5 w-5" />;
    case NotificationType.NewMessage:
      return <MessageSquare className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function getNotificationLink(type: number, role?: number) {
  switch (type) {
    case NotificationType.NewApplication:
      return role === UserRole.Employer
        ? "/companyVacancyCandidates"
        : null;
    case NotificationType.ApplicationStatusChanged:
      return role === UserRole.Candidate ? "/my-applications" : null;
    case NotificationType.NewMessage:
      return "/messages";
    case NotificationType.VacancyApproved:
    case NotificationType.VacancyRejected:
      return role === UserRole.Employer ? "/companyVacancies" : null;
    default:
      return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
