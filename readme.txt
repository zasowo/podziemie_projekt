na stronie głównej wyświetla się nazwa użytkownika i są linki do logowania i rejestracji, ale na razie nie ma sprawdzania użytkownika przy dodawaniu stron itp żeby było łatwiej
strony powinny korzystać z layoutu <BaseLayout title="tytul"> </BaseLayout> ale nie wszędzie chyba go dałem
pod /admin jest formularz do dodawania nowych stron i powinno działać formatowanie tekstu i dodawanie obrazów
wszystko dodaje się do mongodb domyslnie na localhoscie (adres do bazy w pliku .env)
dodane strony wyszukiwane są przez ścieżkę [...slug].astro
w folderze /src/styles/ są pliki do styli, te dwa .scss są zaimportowane do tego edytora stron, a global.css utworzył się z projektem i można go edytować normalnie
w /lib/ są różne funkcje typu połączenie z mongodb
w /api/ jest obsługa autentykacji i backendu do dodawania stron
w /components/ są 2 komponenty które zrobiłem do tworzenia i wyświetlania stron i zaimportowany edytor

wszystko chyba powinno działać jak sie zainstaluje paczki z npm i postawi mongodb