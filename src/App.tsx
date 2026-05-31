import GlobalEnglishTranslator from "./i18n/GlobalEnglishTranslator";
import AppRoutes from "./routes";

function App() {
  return (
    <main>
      <AppRoutes />
      <GlobalEnglishTranslator />
    </main>
  );
}

export default App;
