import {
  BriefcaseBusiness,
  CheckCheck,
  ExternalLink,
  Loader2,
  Search,
  Send,
} from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "./Header";
import { sendChatMessage } from "../services/chatHubClient";
import {
  getStoredUserId,
  hiredInApi,
  type ChatRead,
  type MessageRead,
} from "../services/hiredInApi";

type ChatApiViewProps = {
  mode: "candidate" | "company";
};

export default function ChatApiView({ mode }: ChatApiViewProps) {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const currentUserId = getStoredUserId();
  const [chats, setChats] = useState<ChatRead[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRead[]>([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadChats = useCallback(
    async (preferredChatId?: string) => {
      setIsLoadingChats(true);
      try {
        const data = await hiredInApi.getMyChats();
        setChats(data);
        setSelectedChatId((current) => {
          if (preferredChatId && data.some((chat) => chat.id === preferredChatId)) {
            return preferredChatId;
          }

          if (current && data.some((chat) => chat.id === current)) {
            return current;
          }

          return data[0]?.id ?? null;
        });
        setNotice(data.length ? "" : "Активних чатів поки немає.");
      } catch {
        setChats([]);
        setSelectedChatId(null);
        setNotice("Щоб бачити повідомлення, потрібно увійти в акаунт.");
      } finally {
        setIsLoadingChats(false);
      }
    },
    [],
  );

  useEffect(() => {
    let ignore = false;

    async function boot() {
      try {
        if (applicationId) {
          const chatId = await hiredInApi.createChat(applicationId);
          if (!ignore) await loadChats(chatId);
          return;
        }

        if (!ignore) await loadChats();
      } catch {
        if (!ignore) {
          setNotice("Не вдалося відкрити чат по цій заявці.");
          await loadChats();
        }
      }
    }

    void boot();

    return () => {
      ignore = true;
    };
  }, [applicationId, loadChats]);

  const loadMessages = useCallback(async (chatId: string) => {
    setIsLoadingMessages(true);
    try {
      const data = await hiredInApi.getMessagesByChatId(chatId);
      setMessages(data);
    } catch {
      setMessages([]);
      setNotice("Не вдалося завантажити повідомлення цього чату.");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    let ignore = false;

    async function refresh() {
      if (!selectedChatId || ignore) return;
      await loadMessages(selectedChatId);
    }

    void refresh();
    const intervalId = window.setInterval(refresh, 7000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [loadMessages, selectedChatId]);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? null,
    [chats, selectedChatId],
  );

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chats;

    return chats.filter((chat) => {
      const participantText = chat.participants
        ?.map((participant) => participant.fullName)
        .filter(Boolean)
        .join(" ");

      return [chat.vacancyTitle, chat.lastMessageText, participantText]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [chats, search]);

  const peer = useMemo(
    () =>
      selectedChat?.participants?.find(
        (participant) => participant.userId && participant.userId !== currentUserId,
      ) ??
      selectedChat?.participants?.[0] ??
      null,
    [currentUserId, selectedChat],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!selectedChatId || !content || isSending) return;

    setIsSending(true);
    setNotice("");

    try {
      const message = await sendChatMessage(selectedChatId, content);
      setMessages((current) =>
        current.some((item) => item.id === message.id) ? current : [...current, message],
      );
      setDraft("");
      await loadChats(selectedChatId);
    } catch {
      setNotice("Не вдалося надіслати повідомлення. Перевір вхід в акаунт і спробуй ще раз.");
    } finally {
      setIsSending(false);
    }
  }

  const detailsTitle =
    mode === "candidate"
      ? peer?.fullName || selectedChat?.vacancyTitle || "Компанія"
      : peer?.fullName || "Кандидат";

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="border-r border-[#1E3151] bg-[#0B182C]">
          <div className="p-5">
            <h1 className="text-lg font-extrabold">Повідомлення</h1>

            <label className="relative mt-5 block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F90AA]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  mode === "candidate"
                    ? "Пошук компанії або вакансії"
                    : "Ім'я, навичка або вакансія"
                }
                className="h-11 w-full rounded-lg border border-[#1E3151] bg-[#091526] pl-10 pr-4 text-sm outline-none placeholder:text-[#8EA0BA] focus:border-[#3B82F6]"
              />
            </label>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <button className="rounded-full bg-[#3B82F6] px-4 py-2 font-semibold text-white">
                Усі {filteredChats.length}
              </button>
              {isLoadingChats && (
                <span className="inline-flex items-center gap-2 text-[#8EA0BA]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Завантаження
                </span>
              )}
            </div>
          </div>

          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`flex w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-[#10203A] ${
                  chat.id === selectedChatId ? "border-l-2 border-[#3B82F6] bg-[#10203A]" : ""
                }`}
              >
                <Avatar
                  label={
                    chat.participants?.find((participant) => participant.userId !== currentUserId)
                      ?.fullName ||
                    chat.vacancyTitle ||
                    "Чат"
                  }
                  imageUrl={
                    chat.participants?.find((participant) => participant.userId !== currentUserId)
                      ?.avatarUrl
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="truncate font-bold">
                      {chat.participants?.find((participant) => participant.userId !== currentUserId)
                        ?.fullName ||
                        chat.vacancyTitle ||
                        "Чат"}
                    </p>
                    <span className="text-xs text-[#7F90AA]">
                      {formatShortTime(chat.lastMessageCreatedAtUtc)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#8EA0BA]">
                    {chat.vacancyTitle || "Без вакансії"}
                  </p>
                  <p className="mt-1 truncate text-sm text-[#A8B6CD]">
                    {chat.lastMessageText || "Повідомлень ще немає"}
                  </p>
                </div>
              </button>
            ))}

            {!isLoadingChats && filteredChats.length === 0 && (
              <div className="px-5 py-8 text-sm leading-6 text-[#8EA0BA]">
                {search ? "За цим пошуком чатів не знайдено." : notice}
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-[720px] flex-col">
          <div className="flex items-center gap-4 px-6 py-5">
            <Avatar label={detailsTitle} imageUrl={peer?.avatarUrl} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-extrabold">
                  {detailsTitle}
                </h2>
                {selectedChat && (
                  <span className="text-sm font-semibold text-emerald-400">• Онлайн</span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#8EA0BA]">
                {selectedChat?.vacancyTitle
                  ? `${mode === "candidate" ? "Вакансія" : "Відгук на"} ${selectedChat.vacancyTitle}`
                  : "Оберіть чат зі списку"}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {selectedChat && (
              <div className="mb-6 flex items-center justify-center gap-4 text-xs text-[#52647E]">
                <span className="h-px w-16 bg-[#1E3151]" />
                <span>{formatChatDate(selectedChat.createdAtUtc)}</span>
                <span className="h-px w-16 bg-[#1E3151]" />
              </div>
            )}

            {isLoadingMessages ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#1E3151] bg-[#0B182C] p-8 text-[#8EA0BA]">
                <Loader2 className="h-5 w-5 animate-spin" />
                Завантажуємо повідомлення
              </div>
            ) : selectedChat && messages.length > 0 ? (
              <div className="space-y-5">
                {messages.map((item) => {
                  const isMine = item.senderUserId === currentUserId;

                  return (
                    <div
                      key={item.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[680px] ${isMine ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-xl px-4 py-3 text-sm leading-6 sm:text-base ${
                            isMine ? "bg-[#3B82F6] text-white" : "bg-[#102440] text-[#D7E1EF]"
                          }`}
                        >
                          {item.content}
                        </div>
                        <p
                          className={`mt-1 flex items-center gap-1 text-xs text-[#8EA0BA] ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          {isMine && <CheckCheck className="h-3.5 w-3.5 text-blue-300" />}
                          {formatShortTime(item.createdAtUtc)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#1E3151] bg-[#0B182C] p-8 text-center text-[#8EA0BA]">
                {selectedChat
                  ? "У цьому чаті ще немає повідомлень. Напишіть першим."
                  : notice || "Оберіть чат зі списку зліва."}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#1E3151] p-4 sm:p-5">
            <div className="flex items-center gap-3 rounded-xl border border-[#1E3151] bg-[#091526] p-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={!selectedChatId || isSending}
                placeholder="Написати повідомлення..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#A8B6CD] disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!selectedChatId || !draft.trim() || isSending}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB] disabled:bg-[#1D3152] disabled:text-[#8EA0BA]"
              >
                {isSending ? "Надсилаємо" : "Надіслати"}
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            {notice && <p className="mt-3 text-sm text-amber-300">{notice}</p>}
          </form>
        </section>

        <aside className="hidden border-l border-[#1E3151] bg-[#0B182C] p-5 lg:block">
          <div className="flex items-start gap-3">
            <Avatar label={detailsTitle} imageUrl={peer?.avatarUrl} />
            <div>
              <h3 className="font-extrabold">{detailsTitle}</h3>
              <p className="mt-1 text-sm text-[#8EA0BA]">
                {selectedChat?.vacancyTitle || "Деталі чату"}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-sm">
            <InfoRow
              label={mode === "candidate" ? "Вакансія" : "Позиція"}
              value={selectedChat?.vacancyTitle || "Не обрано"}
            />
            <InfoRow
              label="Статус"
              value={selectedChat ? "Активний чат" : "Чат не обрано"}
            />
            <InfoRow
              label="Учасників"
              value={String(selectedChat?.participants?.length ?? 0)}
            />
          </div>

          <Link
            to={mode === "candidate" ? "/vacanciesList" : "/company-vacancies"}
            className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] text-sm font-bold text-white hover:bg-[#2563EB]"
          >
            {mode === "candidate" ? "Переглянути вакансію" : "Мої вакансії"}
            <ExternalLink className="h-4 w-4" />
          </Link>

          {mode === "candidate" ? (
            <Link
              to="/candidateCabinet"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1E3151] text-sm font-bold text-[#D7E1EF] hover:bg-[#102440]"
            >
              Мій профіль
              <BriefcaseBusiness className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/company-vacancy-candidates"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1E3151] text-sm font-bold text-[#D7E1EF] hover:bg-[#102440]"
            >
              Кандидати
              <BriefcaseBusiness className="h-4 w-4" />
            </Link>
          )}
        </aside>
      </main>
    </div>
  );
}

function Avatar({ label, imageUrl }: { label: string; imageUrl?: string | null }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={label}
        className="h-11 w-11 shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-extrabold text-white">
      {initials(label)}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#1E3151]/60 pb-3">
      <span className="text-[#8EA0BA]">{label}</span>
      <span className="text-right font-semibold text-[#D7E1EF]">{value}</span>
    </div>
  );
}

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : value.slice(0, 2);
  return letters.toUpperCase();
}

function formatShortTime(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatChatDate(value?: string | null) {
  if (!value) return "Сьогодні";
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}
