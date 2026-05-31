import { ArrowRight, Heart, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { hiredInApi, type FavouriteVacancyRead } from "../services/hiredInApi";

export default function FavoriteVacanciesView() {
  const [items, setItems] = useState<FavouriteVacancyRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    hiredInApi
      .getFavouriteVacancies()
      .then((result) => {
        if (ignore) return;
        const favourites = result.items ?? [];
        setItems(favourites);
        setMessage(favourites.length ? "" : "Обраних вакансій поки немає.");
      })
      .catch(() => {
        if (!ignore) {
          setItems([]);
          setMessage("Щоб переглядати обрані вакансії, увійди як кандидат.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function removeFavourite(id: string) {
    setMessage("");

    try {
      await hiredInApi.deleteFavouriteVacancy(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      setMessage("Не вдалося прибрати вакансію з обраних.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-8 lg:px-[80px]">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-300">
              <Heart className="h-4 w-4" />
              Кабінет кандидата
            </p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Обрані вакансії
            </h1>
            <p className="mt-2 text-sm text-[#8EA0BA]">
              {isLoading ? "Завантажуємо збережені вакансії..." : `${items.length} збережено`}
            </p>
          </div>

          <Link
            to="/vacanciesList"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white transition-colors hover:bg-[#2563EB]"
          >
            Знайти ще вакансії
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {message && (
          <div className="mt-6 rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 py-3 text-sm text-[#A8B6CD]">
            {message}
          </div>
        )}

        <section className="mt-8 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold text-white">
                    {item.vacancyName || "Вакансія"}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#8EA0BA]">
                    <span className="font-semibold text-[#D7E1EF]">
                      {item.companyName || "Компанія"}
                    </span>
                    {item.city && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {item.city}
                      </span>
                    )}
                    {item.salary != null && (
                      <span className="rounded-md bg-[#F5C84C]/10 px-2 py-1 font-bold text-[#F5C84C]">
                        {formatMoney(item.salary)} грн
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/vacancy/${item.vacancyId}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-sm font-bold text-white transition-colors hover:bg-[#2563EB]"
                  >
                    Переглянути
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFavourite(item.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-red-500/20 px-4 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Прибрати
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {!isLoading && items.length === 0 && (
          <section className="mt-8 rounded-2xl border border-dashed border-[#1E3151] bg-[#0F1D36] p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-blue-400" />
            <h2 className="mt-4 text-xl font-extrabold">Немає обраних вакансій</h2>
            <p className="mt-2 text-sm text-[#8EA0BA]">
              Додай вакансії зі списку, щоб повернутися до них пізніше.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value);
}
