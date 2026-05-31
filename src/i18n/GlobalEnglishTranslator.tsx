import { useEffect } from "react";
import { type Language, useLanguage } from "./LanguageContext";

const exactTranslations: Record<string, string> = {
  "Вакансії": "Jobs",
  "Всі вакансії": "All jobs",
  "Обрані вакансії": "Saved jobs",
  "Мої вакансії": "My jobs",
  "Активні вакансії": "Active jobs",
  "Відкриті вакансії": "Open jobs",
  "Деталі вакансії": "Job details",
  "Опис вакансії": "Job description",
  "Вакансія без назви": "Untitled job",
  "Вакансію не обрано": "No job selected",
  "Компанії": "Companies",
  "Компанія": "Company",
  "Компаніям": "For companies",
  "Кандидату": "For candidates",
  "Кандидатам": "Candidates",
  "Кандидати": "Candidates",
  "Роботодавцям": "Employers",
  "Про нас": "About",
  "Про компанію": "About company",
  "Про мене": "About me",
  "Про роль": "About the role",
  "Увійти": "Sign in",
  "Вийти": "Sign out",
  "Розпочати": "Get started",
  "Створити": "Create",
  "Створити акаунт": "Create account",
  "Створити резюме": "Create resume",
  "Створити CV": "Create CV",
  "Конструктор резюме": "Resume builder",
  "Конструктор CV": "CV builder",
  "Кабінет кандидата": "Candidate account",
  "Кабінет роботодавця": "Employer account",
  "Кабінет компанії": "Company account",
  "Особистий кабінет": "Personal account",
  "Основна інформація": "Basic information",
  "Ключова інформація": "Key information",
  "Ключові факти": "Key facts",
  "Досвід роботи": "Work experience",
  "Досвід": "Experience",
  "Освіта": "Education",
  "Навички": "Skills",
  "Резюме": "Resume",
  "Резюме (CV)": "Resume (CV)",
  "Файл CV": "CV file",
  "Назва CV": "CV title",
  "Моє CV": "My CV",
  "Прев'ю CV": "CV preview",
  "AI-підбір вакансій": "AI job matching",
  "Підібрати вакансії під моє CV": "Match jobs to my CV",
  "Запустити підбір": "Run matching",
  "AI аналізує...": "AI is analyzing...",
  "Рекомендовані вакансії": "Recommended jobs",
  "AI-поради щодо CV": "AI tips for CV",
  "CV для аналізу": "CV for analysis",
  "Оновити список CV": "Refresh CV list",
  "Бажана посада": "Desired position",
  "Посада": "Position",
  "Рівень": "Level",
  "Рівень посади": "Position level",
  "Тип зайнятості": "Employment type",
  "Формат роботи": "Work format",
  "Формат": "Format",
  "Локація": "Location",
  "Місто": "City",
  "Індустрія": "Industry",
  "Зарплата": "Salary",
  "Видимість": "Visibility",
  "Коротко про себе": "Summary",
  "Пароль": "Password",
  "Робоча пошта": "Work email",
  "Ім'я та прізвище": "Full name",
  "Ще не маєте акаунта?": "Don't have an account?",
  "Вже маєте акаунт?": "Already have an account?",
  "Я роботодавець": "I'm an employer",
  "Я кандидат": "I'm a candidate",
  "Увійти кандидатом": "Sign in as candidate",
  "В кабінет кандидата": "To candidate account",
  "Повна зайнятість": "Full-time",
  "Часткова зайнятість": "Part-time",
  "Контракт": "Contract",
  "Стажування": "Internship",
  "Публічне": "Public",
  "Приватне": "Private",
  "Тільки роботодавцям": "Employers only",
  "Заклад": "Institution",
  "Ступінь": "Degree",
  "Спеціальність": "Field of study",
  "Початок": "Start",
  "Кінець": "End",
  "Працюю тут зараз": "I currently work here",
  "Мої заяви": "My applications",
  "Мої відгуки": "My reviews",
  "Мої резюме": "My resumes",
  "Переглянути кандидатів": "View candidates",
  "Переглянути профіль": "View profile",
  "Переглянути повний профіль": "View full profile",
  "Переглянути вакансію": "View job",
  "Переглянути компанію": "View company",
  "Сторінка компанії": "Company page",
  "Опублікувати зміни": "Publish changes",
  "Змінити": "Edit",
  "Редагувати": "Edit",
  "Редагувати блок": "Edit block",
  "Зберегти": "Save",
  "Зберегти блок": "Save block",
  "Скасувати": "Cancel",
  "Готово": "Done",
  "Додати": "Add",
  "Додати поле": "Add field",
  "Видалити": "Delete",
  "Завантажити CV": "Upload CV",
  "Завантажити резюме": "Upload resume",
  "Завантажити ще": "Load more",
  "Відгуки": "Reviews",
  "Відгуки співробітників": "Employee reviews",
  "Співробітники": "Employees",
  "Співробітників": "Employees",
  "Пошук": "Search",
  "Знайти": "Find",
  "Фільтри": "Filters",
  "Скинути": "Reset",
  "Очистити все": "Clear all",
  "Сортувати": "Sort",
  "Сортувати:": "Sort:",
  "Для тебе": "For you",
  "За датою": "By date",
  "За зарплатою": "By salary",
  "За датою додавання": "By date added",
  "За алфавітом": "Alphabetically",
  "Найбільше вакансій": "Most jobs",
  "Усі": "All",
  "Активні": "Active",
  "Закриті": "Closed",
  "Активна": "Active",
  "Закрита": "Closed",
  "Чернетка": "Draft",
  "Архівна": "Archived",
  "На розгляді": "In review",
  "Прийнято": "Accepted",
  "Відхилено": "Rejected",
  "Подано": "Submitted",
  "Інтерв'ю": "Interview",
  "Прийняти": "Accept",
  "Відмовити": "Reject",
  "Закрити": "Close",
  "Активувати": "Activate",
  "Чат": "Chat",
  "Повідомлення": "Messages",
  "Непрочитані": "Unread",
  "Архів": "Archive",
  "Написати повідомлення...": "Write a message...",
  "Надіслати": "Send",
  "Київ": "Kyiv",
  "Львів": "Lviv",
  "Одеса": "Odesa",
  "Харків": "Kharkiv",
  "Україна": "Ukraine",
  "Віддалено": "Remote",
  "Офіс": "Office",
  "Гібрид": "Hybrid",
  "Remote": "Remote",
  "Hybrid": "Hybrid",
  "On-site": "On-site",
  "Профіль заповнений на": "Profile completed",
  "рейтинґ": "rating",
  "рейтинг": "rating",
  "відкритих вакансій": "open jobs",
  "кандидатів": "candidates",
  "співробітники": "employees",
  "відгуки": "reviews",
  "сьогодні": "today",
  "Нових відгуків": "New reviews",
  "Стан вакансії": "Job status",
  "У найплайні": "In pipeline",
  "У пайплайні": "In pipeline",
  "Опубліковано": "Published",
  "Швидкий відгук": "Quick apply",
  "Що потрібно буде робити": "What you will do",
  "Наші очікування": "What we expect",
  "Буде плюсом": "Nice to have",
  "Що ми пропонуємо": "What we offer",
  "Технологічний стек": "Technology stack",
  "Наша місія": "Our mission",
  "Наша історія": "Our story",
  "Цінності": "Values",
  "Люди, які це будують": "The people building this",
  "Приєднуйтесь до Kriposnyj": "Join Kriposnyj",
  "Шукати роботу": "Find a job",
  "Показати всі": "Show all",
  "Додати вакансію": "Add job",
  "Вакансій поки немає.": "There are no jobs yet.",
  "Ключові факти ще не заповнено.": "Key facts have not been filled in yet.",
  "Деталі не вказано": "Details not specified",
  "Рейтинг ще не сформовано": "Rating has not been formed yet",
  "Немає відгуків": "No reviews",
  "Відгуків поки немає": "There are no reviews yet",
  "Працівників поки не додано": "No employees have been added yet",
  "Співробітників поки не додано": "No employees have been added yet",
  "Посада не вказана": "Position not specified",
  "Місто не вказано": "City not specified",
  "Відкритий до пропозицій": "Open to offers",
  "Досвід не вказано": "Experience not specified",
  "Період не вказано": "Period not specified",
  "Поточна роль": "Current role",
  "Досвід роботи ще не додано.": "Work experience has not been added yet.",
  "Освіту ще не додано.": "Education has not been added yet.",
  "Опис досвіду не додано.": "Experience description has not been added yet.",
  "Редагувати в конструкторі CV": "Edit in CV builder",
  "Відкрити всі вакансії": "Open all jobs",
  "Поради з'являться після аналізу CV.": "Tips will appear after CV analysis.",
  "Порада": "Tip",
  "Український сервіс пошуку роботи. Чесно, прозоро, без посередників.":
    "A Ukrainian job search service. Honest, transparent, without middlemen.",
  "Робота в Україні — напряму від компаній. Без посередників.":
    "Jobs in Ukraine directly from companies. No middlemen.",
  "© 2026 Kriposnyj. Зроблено в Україні.": "© 2026 Kriposnyj. Made in Ukraine.",
};

const phraseTranslations: Array<[string, string]> = [
  ["Для кандидата", "For candidates"],
  ["Для компаній", "For companies"],
  ["Як користуватися Kriposnyj, якщо ти шукаєш роботу", "How to use Kriposnyj when you are looking for a job"],
  ["Як компанії користуватися Kriposnyj", "How companies use Kriposnyj"],
  ["Створи профіль кандидата", "Create a candidate profile"],
  ["Заповни основну інформацію", "Fill in the basic information"],
  ["бажану роль", "desired role"],
  ["місто", "city"],
  ["формат роботи", "work format"],
  ["рівень досвіду", "experience level"],
  ["Додай резюме", "Add a resume"],
  ["Опиши освіту", "Describe your education"],
  ["досвід", "experience"],
  ["навички", "skills"],
  ["проєкти", "projects"],
  ["завантаж CV-файл", "upload a CV file"],
  ["роботодавцям", "employers"],
  ["Шукай вакансії", "Search for jobs"],
  ["Фільтруй вакансії", "Filter jobs"],
  ["за посадою", "by position"],
  ["містом", "city"],
  ["форматом", "format"],
  ["рівнем", "level"],
  ["зарплатою", "salary"],
  ["технологіями", "technologies"],
  ["Подавай заявки", "Apply to jobs"],
  ["Надсилай заявку", "Send an application"],
  ["відстежуй статус", "track the status"],
  ["переходь у чат", "move to chat"],
  ["коли компанія відповідає", "when the company replies"],
  ["Що доступно кандидату", "What candidates can use"],
  ["Обрані вакансії", "Saved jobs"],
  ["Зберігай цікаві пропозиції", "Save interesting offers"],
  ["повертайся до них пізніше", "come back to them later"],
  ["Дивись усі заявки", "View all applications"],
  ["статус розгляду", "review status"],
  ["прийняті й відхилені відгуки", "accepted and rejected responses"],
  ["Чат з компаніями", "Chat with companies"],
  ["Узгоджуй інтерв'ю", "Schedule interviews"],
  ["уточнюй деталі ролі", "clarify role details"],
  ["отримуй відповіді від рекрутерів", "get replies from recruiters"],
  ["Підбір за резюме", "Matching by resume"],
  ["Пояснення збігу", "Match explanation"],
  ["Поради перед відгуком", "Tips before applying"],
  ["Як AI допомагає кандидату знайти релевантну вакансію", "How AI helps a candidate find a relevant job"],
  ["Спробувати AI-підбір", "Try AI matching"],
  ["Це допоміжний інструмент", "This is an assistant tool"],
  ["він не вирішує за тебе", "it does not decide for you"],
  ["куди подаватися", "where to apply"],
  ["показує найрелевантніші пропозиції", "shows the most relevant offers"],
  ["пояснює збіг із резюме", "explains the resume match"],
  ["дає поради", "gives tips"],
  ["як підсилити відгук", "how to strengthen the application"],
  ["Найкращий старт", "Best start"],
  ["Відкрити кабінет", "Open account"],
  ["Оформіть публічний профіль", "Create a public profile"],
  ["публікуйте вакансії", "publish jobs"],
  ["переглядайте кандидатів", "review candidates"],
  ["керуйте статусами заявок", "manage application statuses"],
  ["ведіть комунікацію", "run communication"],
  ["без окремих таблиць", "without separate spreadsheets"],
  ["хаосу в повідомленнях", "message chaos"],
  ["Зареєструвати компанію", "Register company"],
  ["Приклад кабінету", "Account example"],
  ["уже з нами", "already with us"],
  ["Основний маршрут компанії", "Main company flow"],
  ["4 кроки від реєстрації до першого найму", "4 steps from registration to the first hire"],
  ["Лінійний процес без зайвих кроків", "A linear process without extra steps"],
  ["Ти бачиш статус кожної заявки", "You see the status of every application"],
  ["в одному кабінеті", "in one account"],
  ["від відгуку до офера", "from response to offer"],
  ["Створи сторінку компанії", "Create a company page"],
  ["Додай опис", "Add a description"],
  ["логотип", "logo"],
  ["факти", "facts"],
  ["офіси", "offices"],
  ["кількість співробітників", "employee count"],
  ["посилання", "links"],
  ["Опублікуй вакансію", "Publish a job"],
  ["Опиши роль", "Describe the role"],
  ["стек", "stack"],
  ["вимоги", "requirements"],
  ["статус вакансії", "job status"],
  ["активна або закрита", "active or closed"],
  ["Переглядай кандидатів", "Review candidates"],
  ["Після відгуків бачиш список кандидатів", "After applications you see the candidate list"],
  ["їхній профіль", "their profile"],
  ["резюме", "resume"],
  ["Спілкуйся в чаті", "Communicate in chat"],
  ["Домовляйся про інтерв'ю", "Arrange interviews"],
  ["проси уточнення", "ask for clarification"],
  ["приймай або відхиляй заявку", "accept or reject an application"],
  ["Функціонал для компанії", "Company functionality"],
  ["Усе для роботодавця в одному кабінеті", "Everything for employers in one account"],
  ["Кабінет компанії", "Company account"],
  ["Режим редагування", "Edit mode"],
  ["налаштування профілю", "profile setup"],
  ["брендингу", "branding"],
  ["Список вакансій", "Job list"],
  ["Активні, чернетки, закриті", "Active, drafts, closed"],
  ["все в одному місці", "everything in one place"],
  ["Детальний опис вакансії", "Detailed job description"],
  ["Список кандидатів", "Candidate list"],
  ["Усі, хто відгукнувся", "Everyone who applied"],
  ["Чат з кандидатами", "Chat with candidates"],
  ["Без email і месенджерів", "Without email and messengers"],
  ["спілкування на платформі", "communication on the platform"],
  ["Відгуки і рейтинг", "Reviews and rating"],
  ["Прозора репутація", "Transparent reputation"],
  ["Повний список можливостей", "Full feature list"],
  ["Як працює найм", "How hiring works"],
  ["Створити вакансію", "Create a job"],
  ["Кандидат подає заявку", "Candidate applies"],
  ["Перегляд профілю", "Profile review"],
  ["Чат і офер", "Chat and offer"],
  ["Мої вакансії", "My jobs"],
  ["Готові розпочати найм", "Ready to start hiring"],
  ["Зареєструйте компанію", "Register your company"],
  ["за 5 хвилин", "in 5 minutes"],
  ["опублікуйте першу вакансію", "publish your first job"],
  ["вже сьогодні", "today"],
  ["Жодних агенцій", "No agencies"],
  ["Жодних прихованих комісій", "No hidden fees"],
  ["Перша вакансія безкоштовно", "First job is free"],
  ["Робота напряму", "Direct jobs"],
  ["Найм напряму", "Direct hiring"],
  ["без HR-агенцій", "without HR agencies"],
  ["без посередників", "without middlemen"],
  ["Без посередників", "No middlemen"],
  ["Створи кабінет кандидата", "Create a candidate account"],
  ["Створи кабінет компанії", "Create a company account"],
  ["Увійди в акаунт", "Sign in to your account"],
  ["Увійди в кабінет кандидата", "Sign in to the candidate account"],
  ["Увійди в кабінет компанії", "Sign in to the company account"],
  ["керувати резюме", "manage your resume"],
  ["керувати вакансіями", "manage vacancies"],
  ["повідомленнями", "messages"],
  ["рекомендаціями вакансій", "job recommendations"],
  [
    "Після реєстрації можна створити профіль компанії",
    "After registration, you can create your company profile",
  ],
  [
    "Створи CV, додай освіту, досвід, навички та прикріпи файл для заявок",
    "Create a CV, add education, experience, skills, and attach a file for applications",
  ],
  ["Система бере резюме кандидата", "The system uses the candidate CV"],
  ["Без заглушок", "No mock data"],
  ["Рекомендацій поки немає", "There are no recommendations yet"],
  ["Обери CV", "Choose a CV"],
  ["Потрібен вхід кандидата", "Candidate sign-in is required"],
  ["Не вибрано", "Not selected"],
  ["не обрано", "not selected"],
  ["мінімум 8 символів", "at least 8 characters"],
  ["Створюємо", "Creating"],
  ["Входимо", "Signing in"],
  ["Знайдено вакансій", "Jobs found"],
  ["Знайдено компаній", "Companies found"],
  ["Найкращий збіг", "Best match"],
  ["збіг", "match"],
  ["Чому підходить", "Why it fits"],
  ["Що підтягнути", "What to improve"],
  ["Зарплата не вказана", "Salary not specified"],
  ["Локація не вказана", "Location not specified",
  ],
  ["Формат не вказано", "Format not specified"],
  ["Рівень не вказано", "Level not specified"],
  ["Індустрія не вказана", "Industry not specified"],
  ["Компанія ще не додала опис", "The company has not added a description yet"],
  ["Опис компанії ще не додано", "Company description has not been added yet"],
  ["Опис вакансії ще не додано", "Job description has not been added yet"],
  ["Поки немає опублікованих вакансій", "There are no published jobs yet"],
  ["У компанії ще немає вакансій", "This company has no jobs yet"],
  ["За цією вакансією ще немає заявок", "There are no applications for this job yet"],
  ["Список вакансій порожній", "The job list is empty"],
  ["За поточними фільтрами вакансій не знайдено", "No jobs found for the current filters"],
  ["За поточними фільтрами компаній не знайдено", "No companies found for the current filters"],
  ["Усі вакансії вже завантажено", "All jobs are already loaded"],
  ["Усі компанії вже завантажено", "All companies are already loaded"],
  ["Показано", "Showing"],
  ["із", "of"],
  ["перевірених компаній", "verified companies"],
  ["перевірена компанія", "verified company"],
  ["Перевірена компанія", "Verified company"],
  ["Активні:", "Active:"],
  ["Результати з активного списку вакансій", "Results from the active job list"],
  ["Вакансії компанії", "Company jobs"],
  ["Вакансії обраної компанії", "Selected company jobs"],
  ["Пошук за назвою", "Search by title"],
  ["Пошук за назвою...", "Search by title..."],
  ["Будь-яка", "Any"],
  ["Будь-яке", "Any"],
  ["З вказаною ЗП", "With salary specified"],
  ["Тільки з вказаною ЗП", "Only with specified salary"],
  ["Вакансія вже в обраних", "Job is already saved"],
  ["Додати вакансію в обрані", "Save job"],
  ["Вакансію додано в обрані", "Job saved"],
  ["Не вдалося додати в обрані", "Could not save the job"],
  ["Увійди як кандидат і спробуй ще раз", "Sign in as a candidate and try again"],
  ["Обраних вакансій поки немає", "There are no saved jobs yet"],
  ["Знайти ще вакансії", "Find more jobs"],
  ["Додай вакансії зі списку", "Save jobs from the list"],
  ["щоб повернутися до них пізніше", "to return to them later"],
  ["Сесія закінчилась або немає доступу", "The session has expired or access is missing"],
  ["Увійди в акаунт кандидата ще раз", "Sign in to the candidate account again"],
  ["Завантажуємо вакансії", "Loading jobs"],
  ["Завантажую вакансії", "Loading jobs"],
  ["Завантажуємо компанії", "Loading companies"],
  ["Завантажуємо заяви", "Loading applications"],
  ["Завантаження", "Loading"],
  ["Зміни збережено", "Changes saved"],
  ["Активних чатів поки немає", "There are no active chats yet"],
  ["Щоб бачити повідомлення, потрібно увійти в акаунт", "Sign in to see messages"],
  ["Не вдалося відкрити чат по цій заявці", "Could not open the chat for this application"],
  ["Не вдалося завантажити повідомлення цього чату", "Could not load messages for this chat"],
  ["Не вдалося надіслати повідомлення", "Could not send the message"],
  ["Перевір вхід в акаунт і спробуй ще раз", "Check your sign-in and try again"],
  ["Пошук компанії або вакансії", "Search company or job"],
  ["Усі", "All"],
  ["Чатів не знайдено", "No chats found"],
  ["За цим пошуком чатів не знайдено", "No chats found for this search"],
  ["Оберіть чат зі списку", "Select a chat from the list"],
  ["Оберіть чат зі списку зліва", "Select a chat from the list on the left"],
  ["У цьому чаті ще немає повідомлень", "There are no messages in this chat yet"],
  ["Напишіть першим", "Write first"],
  ["Завантажуємо повідомлення", "Loading messages"],
  ["Надсилаємо", "Sending"],
  ["Деталі чату", "Chat details"],
  ["Без вакансії", "No job"],
  ["Повідомлень ще немає", "No messages yet"],
  ["Оберіть чат", "Select a chat"],
  ["Активний чат", "Active chat"],
  ["Чат не обрано", "No chat selected"],
  ["Учасників", "Participants"],
  ["Мій профіль", "My profile"],
  [
    "Не вдалося зберегти зміни. Перевір авторизацію або спробуй ще раз.",
    "Could not save changes. Check authorization or try again.",
  ],
  ["Розкажи про досвід, контакти, проєкти й очікування", "Tell about experience, contacts, projects, and expectations"],
  ["Опис поки не додано", "No description added yet"],
  ["Додати досвід", "Add experience"],
  ["Додати освіту", "Add education"],
  ["Додати навичку", "Add skill"],
  ["Видалити досвід", "Delete experience"],
  ["Видалити освіту", "Delete education"],
  ["Зробити основним резюме", "Make this the primary resume"],
  ["Фільтри за стеком, зарплатою, форматом роботи", "Filters by stack, salary, and work format"],
  ["Бачте, що відбувається з заявкою", "See what is happening with your application"],
  ["Чат з рекрутером без ботів та посередників", "Chat with a recruiter without bots or middlemen"],
  ["Будуйте профіль один раз, подавайтесь скрізь", "Build your profile once and apply everywhere"],
  ["Просто. Швидко. Без посередників.", "Simple. Fast. No middlemen."],
  ["Кандидати шукають. Роботодавці наймають.", "Candidates search. Employers hire."],
  ["Робота зручно відкривається з телефона", "Work opens comfortably from your phone"],
  ["Мобільна версія сайту", "Mobile website version"],
  ["Без встановлення", "No installation"],
  ["Зручно з малого екрана", "Comfortable on small screens"],
  ["Одна версія для всіх", "One version for everyone"],
  ["Той самий сайт", "The same website"],
  ["у мобільному браузері", "in a mobile browser"],
  ["Ваша наступна робота", "Your next job"],
  ["за один клік", "in one click"],
  ["Реєстрація за 60 секунд", "Registration in 60 seconds"],
  ["Без комісій", "No fees"],
  ["прихованих платежів", "hidden payments"],
  ["Можливості", "Features"],
  ["Розумний підбір", "Smart matching"],
  ["Прямий чат", "Direct chat"],
  ["Чесні сторінки компаній", "Transparent company pages"],
  ["Трендові вакансії", "Trending jobs"],
  ["Найгарячіші вакансії", "Hottest openings"],
  ["Що шукають найчастіше цього тижня", "Most searched this week"],
  ["Як знайти роботу", "How to find a job"],
  ["покроково", "step by step"],
  ["Від першого пошуку до підписаного офера", "From the first search to a signed offer"],
  ["Практичні поради", "Practical tips"],
  ["для кожного етапу", "for every stage"],
  ["Вперед", "Start"],
  ["Через API", "API ready"],
  ["Відгуки співробітників", "Employee reviews"],
  ["Що кажуть команди", "What teams say"],
  ["Загальний рейтинг", "Overall rating"],
  ["На основі", "Based on"],
  ["Залишити відгук", "Leave a review"],
  ["Після модерації", "After moderation"],
  ["Спочатку нові", "Newest first"],
  ["Сторінка", "Page"],
  ["Назад до профілю", "Back to profile"],
  ["До профілю", "To profile"],
  ["відгуків", "reviews"],
  ["відгуки", "reviews"],
  ["відгук", "review"],
  ["кандидатів", "candidates"],
  ["кандидати", "candidates"],
  ["вакансій", "jobs"],
  ["вакансії", "jobs"],
  ["вакансія", "job"],
  ["співробітників", "employees"],
  ["співробітники", "employees"],
  ["відкритих", "open"],
  ["активних", "active"],
  ["нових", "new"],
  ["нові", "new"],
  ["сьогодні", "today"],
  ["зараз", "now"],
  ["вчора", "yesterday"],
  ["тиждень", "week"],
  ["місяць", "month"],
  ["років", "years"],
  ["роки", "years"],
  ["рік", "year"],
  ["міс.", "mo."],
  ["год", "h"],
  ["днів", "days"],
  ["дні", "days"],
  ["день", "day"],
  ["Подано", "Submitted"],
  ["оновлено", "updated"],
  ["поточна", "current"],
  ["Поточна", "Current"],
  ["від", "from"],
  ["до", "to"],
  ["грн", "UAH"],
  ["тис.", "k"],
];

const attributeTranslations: Record<string, string> = {
  "Пошук за назвою": "Search by title",
  "Пошук компаній або вакансії": "Search companies or jobs",
  "Пошук вакансій...": "Search jobs...",
  "Пошук за назвою...": "Search by title...",
  "Посада, компанія, ключове слово": "Position, company, keyword",
  "Введіть запит...": "Enter a query...",
  "Будь-яка": "Any",
  "Будь-яке": "Any",
  "Назва компанії": "Company name",
  "Короткий опис компанії": "Short company description",
  "Детально опишіть компанію.": "Describe the company in detail.",
  "Київ, Україна": "Kyiv, Ukraine",
  "Київ": "Kyiv",
  "Ім'я, навичка або вакансія": "Name, skill, or job",
  "Написати повідомлення...": "Write a message...",
  "мінімум 8 символів": "at least 8 characters",
  "Олександр Коваленко": "Alex Kovalenko",
  "Марина Тарасенко": "Maryna Tarasenko",
  "Розкажи про досвід, контакти, проєкти й очікування.": "Tell about experience, contacts, projects, and expectations.",
  "Закрити фільтри": "Close filters",
  "Відкрити фільтри": "Open filters",
  "Закрити меню": "Close menu",
  "Відкрити меню": "Open menu",
  "Очистити фільтр": "Clear filter",
};

const phrasePatterns = phraseTranslations
  .slice()
  .sort((a, b) => b[0].length - a[0].length)
  .map(([source, replacement]) => [new RegExp(escapeRegExp(source), "g"), replacement] as const);

const originalText = new WeakMap<Text, string>();
const sourceLanguagePattern = /[А-Яа-яІіЇїЄєҐґ]/;
const mojibakePattern =
  /[РС][ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЎЏђ‘’“”•–—™љ›њћџЁЄ«Ііґ·№є»јЅѕї°±µ¶¤¦§©¬®Ї]/;

export default function GlobalEnglishTranslator() {
  const { language } = useLanguage();

  useEffect(() => {
    const apply = () => applyLanguage(language);
    apply();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(apply);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"],
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
}

function applyLanguage(language: Language) {
  translateTextNodes(document.body, language);
  translateAttributes(document.body, language);
}

function translateTextNodes(root: HTMLElement, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || shouldSkipTextParent(parent)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  for (const node of nodes) {
    const current = node.textContent ?? "";
    const stored = originalText.get(node);

    if (!stored) {
      originalText.set(node, current);
    } else if (language === "uk") {
      const translatedStored = translate(stored);
      if (current !== translatedStored) {
        originalText.set(node, current);
      }
    } else if (containsSourceLanguage(current)) {
      originalText.set(node, current);
    }

    const source = originalText.get(node) ?? current;
    node.textContent = language === "en" ? translate(source) : source;
  }
}

function translateAttributes(root: HTMLElement, language: Language) {
  const elements = root.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title]");

  for (const element of elements) {
    if (shouldSkipAttributeElement(element)) continue;

    for (const attr of ["placeholder", "aria-label", "title"]) {
      const value = element.getAttribute(attr);
      if (!value) continue;

      const originalAttr = `data-i18n-original-${attr}`;
      const stored = element.getAttribute(originalAttr);

      if (!stored || (language === "en" && containsSourceLanguage(value))) {
        element.setAttribute(originalAttr, value);
      } else if (language === "uk" && value !== translate(stored)) {
        element.setAttribute(originalAttr, value);
      }

      const original = element.getAttribute(originalAttr) ?? value;
      element.setAttribute(attr, language === "en" ? translate(original) : original);
    }
  }
}

function shouldSkipTextParent(element: Element) {
  const tag = element.tagName;
  return (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "NOSCRIPT" ||
    tag === "TEXTAREA" ||
    tag === "INPUT" ||
    element.closest("[data-no-translate]") !== null
  );
}

function shouldSkipAttributeElement(element: Element) {
  const tag = element.tagName;
  return (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "NOSCRIPT" ||
    element.closest("[data-no-translate]") !== null
  );
}

function translate(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const normalized = decodeMojibake(value.trim());

  if (!normalized) return value;

  const exact = exactTranslations[normalized];
  if (exact) return `${leading}${exact}${trailing}`;

  const attr = attributeTranslations[normalized];
  if (attr) return `${leading}${attr}${trailing}`;

  let translated = normalized;

  for (const [pattern, replacement] of phrasePatterns) {
    translated = translated.replace(pattern, replacement);
  }

  if (containsSourceLanguage(translated)) {
    translated = translateCommonWords(translated);
  }

  return `${leading}${translated}${trailing}`;
}

function translateCommonWords(value: string) {
  let translated = value;

  const common: Array<[RegExp, string]> = [
    [/Робота/g, "Work"],
    [/робота/g, "work"],
    [/Роботу/g, "Work"],
    [/роботу/g, "work"],
    [/Ринку/g, "Market"],
    [/ринку/g, "market"],
    [/Український/g, "Ukrainian"],
    [/український/g, "Ukrainian"],
    [/Українська/g, "Ukrainian"],
    [/Україна/g, "Ukraine"],
    [/Україні/g, "Ukraine"],
    [/України/g, "Ukraine"],
    [/українських/g, "Ukrainian"],
    [/українцями/g, "Ukrainians"],
    [/кандидатами/g, "candidates"],
    [/кандидатів/g, "candidates"],
    [/кандидати/g, "candidates"],
    [/Кандидатів/g, "Candidates"],
    [/компаніями/g, "companies"],
    [/компаній/g, "companies"],
    [/компанії/g, "company"],
    [/компанію/g, "company"],
    [/компанія/g, "company"],
    [/компаніям/g, "for companies"],
    [/Компаній/g, "Companies"],
    [/Компанія/g, "Company"],
    [/Кандидату/g, "For candidates"],
    [/кандидату/g, "for candidates"],
    [/кандидата/g, "candidate"],
    [/роботодавцями/g, "employers"],
    [/роботодавці/g, "employers"],
    [/роботодавця/g, "employer"],
    [/рекрутером/g, "recruiter"],
    [/вакансіями/g, "jobs"],
    [/вакансію/g, "job"],
    [/вакансії/g, "jobs"],
    [/Вакансії/g, "Jobs"],
    [/профіль/g, "profile"],
    [/профілем/g, "profile"],
    [/профілю/g, "profile"],
    [/профілі/g, "profile"],
    [/заявкою/g, "application"],
    [/заявці/g, "application"],
    [/заявку/g, "application"],
    [/заявки/g, "applications"],
    [/заявок/g, "applications"],
    [/заяви/g, "applications"],
    [/Заяви/g, "Applications"],
    [/вимоги/g, "requirements"],
    [/зарплати/g, "salaries"],
    [/зарплата/g, "salary"],
    [/Зарплата/g, "Salary"],
    [/навички/g, "skills"],
    [/навичок/g, "skills"],
    [/Навичка/g, "Skill"],
    [/досвід/g, "experience"],
    [/Досвід/g, "Experience"],
    [/досвіду/g, "experience"],
    [/освіту/g, "education"],
    [/освіта/g, "education"],
    [/Освіта/g, "Education"],
    [/відгуки/g, "reviews"],
    [/відгуків/g, "reviews"],
    [/Відгук/g, "Review"],
    [/відгук/g, "review"],
    [/співробітників/g, "employees"],
    [/співробітники/g, "employees"],
    [/співробітник/g, "employee"],
    [/працівників/g, "employees"],
    [/без/g, "without"],
    [/напряму/g, "directly"],
    [/прямий/g, "direct"],
    [/прозорі/g, "transparent"],
    [/прозоро/g, "transparently"],
    [/чесні/g, "honest"],
    [/реальні/g, "real"],
    [/прихованих/g, "hidden"],
    [/комісій/g, "fees"],
    [/посередників/g, "middlemen"],
    [/агенцій/g, "agencies"],
    [/знайдіть/g, "find"],
    [/Знайдіть/g, "Find"],
    [/Знайти/g, "Find"],
    [/знайти/g, "find"],
    [/шукають/g, "search"],
    [/Шукай/g, "Search"],
    [/шукати/g, "search"],
    [/наймають/g, "hire"],
    [/створена/g, "created"],
    [/створити/g, "create"],
    [/публікуйте/g, "publish"],
    [/опубліковано/g, "published"],
    [/Опубліковано/g, "Published"],
    [/переглядайте/g, "view"],
    [/переглянути/g, "view"],
    [/Переглянути/g, "View"],
    [/керуйте/g, "manage"],
    [/ведіть/g, "run"],
    [/спілкування/g, "communication"],
    [/підбір/g, "matching"],
    [/Підбір/g, "Matching"],
    [/подавайтесь/g, "apply"],
    [/подати/g, "apply"],
    [/Подати/g, "Apply"],
    [/покращити/g, "improve"],
    [/підходить/g, "fits"],
    [/поточна/g, "current"],
    [/Поточна/g, "Current"],
    [/новинка/g, "new"],
    [/Новинка/g, "New"],
    [/нових/g, "new"],
    [/Нових/g, "New"],
    [/нові/g, "new"],
    [/Нові/g, "New"],
    [/сьогодні/g, "today"],
    [/Сьогодні/g, "Today"],
    [/зараз/g, "now"],
    [/віддалено/g, "remote"],
    [/Віддалено/g, "Remote"],
    [/гібрид/g, "hybrid"],
    [/Гібрид/g, "Hybrid"],
    [/офіс/g, "office"],
    [/Офіс/g, "Office"],
    [/Київ/g, "Kyiv"],
    [/Львів/g, "Lviv"],
    [/Харків/g, "Kharkiv"],
    [/Одеса/g, "Odesa"],
    [/місто/g, "city"],
    [/Місто/g, "City"],
    [/локація/g, "location"],
    [/Локація/g, "Location"],
    [/посада/g, "position"],
    [/Посада/g, "Position"],
    [/назва/g, "name"],
    [/Назва/g, "Name"],
    [/грн/g, "UAH"],
  ];

  for (const [pattern, replacement] of common) {
    translated = translated.replace(pattern, replacement);
  }

  return translated;
}

function containsSourceLanguage(value: string) {
  return sourceLanguagePattern.test(value) || looksMojibake(value);
}

function decodeMojibake(value: string) {
  if (!looksMojibake(value)) {
    return value;
  }

  const bytes: number[] = [];
  for (const char of value) {
    const byte = unicodeToCp1251Byte(char);
    if (byte == null) return value;
    bytes.push(byte);
  }

  try {
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(
      new Uint8Array(bytes),
    );
    if (decoded.includes("\uFFFD")) return value;
    return decoded;
  } catch {
    return value;
  }
}

function looksMojibake(value: string) {
  return mojibakePattern.test(value) || /вЂ|В[«»·©®°±]/.test(value);
}

let cp1251ByteByChar: Map<string, number> | null = null;

function unicodeToCp1251Byte(char: string) {
  const code = char.charCodeAt(0);
  if (code <= 0x7f) return code;

  const map = getCp1251ByteMap();
  return map.get(char) ?? null;
}

function getCp1251ByteMap() {
  if (cp1251ByteByChar) return cp1251ByteByChar;

  const decoder = new TextDecoder("windows-1251");
  cp1251ByteByChar = new Map<string, number>();

  for (let byte = 0; byte <= 255; byte += 1) {
    const char = decoder.decode(new Uint8Array([byte]));
    cp1251ByteByChar.set(char, byte);
  }

  return cp1251ByteByChar;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
