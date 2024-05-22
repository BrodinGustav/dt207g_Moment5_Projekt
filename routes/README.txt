# Restauranghanteringssystem REST API

Detta repository innehåller koden för ett REST API byggt med Express, som möjliggör hantering av personal och meny för en restaurang. 
API:et hanterar användarautentisering med hjälp av JSON Web Tokens (JWT). Grundläggande funktionalitet för CRUD (Create, Read, Update, Delete) är implementerad för både personal och meny.

## Installation och Databas

API:et använder en MongoDB-databas för lagring av användar- och menyinformation. Följ dessa steg för att installera och köra API:et lokalt:

1. Klona detta repository till din lokala maskin.

2. Kör kommandot `npm install` för att installera alla nödvändiga npm-paket.

3. Konfigurera din `.env`-fil med nödvändiga miljövariabler för att ansluta till din MongoDB-databas och skapa en hemlig nyckel för att signera JWT. Se till att du har en MongoDB-databas igång.

4. Starta servern med kommandot `npm run serve`.

## Användning

API:et kan nås med olika HTTP-metoder och ändpunkter för att utföra olika åtgärder. Nedan beskrivs hur man använder API:et:

### Personalhantering

| Metod | Ändpunkt           | Beskrivning                                                  |
|-------|--------------------|--------------------------------------------------------------|
| POST  | /api/register      | Registrerar en ny användare. Kräver användarnamn och lösenord i begäran. |
| POST  | /api/login         | Loggar in en befintlig användare. Kräver användarnamn och lösenord i begäran. |
| GET   | /api/staff         | Hämtar alla anställda                                         |
| PUT   | /api/staff/:id     | Uppdaterar lösenordet för en befintlig användare. Kräver användar-ID och nytt lösenord i begäran. |
| DELETE| /api/staff/:id     | Raderar en användare med angivet ID.                          |

### Menyhantering

| Metod | Ändpunkt         | Beskrivning                                                  |
|-------|------------------|--------------------------------------------------------------|
| POST  | /api/createMenu  | Skapar en ny maträtt. Kräver namn, beskrivning och pris i begäran. |
| GET   | /api/menu        | Hämtar alla maträtter                                         |
| GET   | /api/menu/:id    | Hämtar en specifik maträtt med angivet ID                      |
| PUT   | /api/menu/:id    | Uppdaterar en maträtt med angivet ID. Kräver namn, beskrivning och pris i begäran. |
| DELETE| /api/menu/:id    | Raderar en maträtt med angivet ID.                             |

## Objektstruktur

Nedan är strukturen för ett personal- och menyobjekt som returneras eller skickas i JSON-format:

### Personalobjekt

{
    "username": "Gustav",
    "password": "$2b$10$m.7RMpEfPNozp06sZXOoTeoUqSNmyN.vHadSOqiyCGqLC8znT87/O",
    "created": "2024-05-13T20:18:53.481Z"
}

### Menyobjekt
{
    "name": "Pasta Bolognese",
    "description": "Traditionell italiensk pasta med köttfärssås",
    "price": 120,
    "created": "2024-05-13T20:18:53.481Z"
}

#### Projektstruktur

moment5_projekt/
├── models/
│   ├── staff.js
│   └── menu.js
├── routes/
│   └── authRoutes.js
├── .env
├── .envsample
├── package.json
├── server.js
└── README.md

### Teknologier

Node.js
Express
MongoDB
Mongoose
JWT (JsonWebToken)
Bcrypt
Cors

#### Författare

Projektet är skapat av Gustav Brodin.

---------------------------------------
Denna README-fil ger en översikt över hur man installerar, konfigurerar och använder ditt API, inklusive vilka ändpunkter som är tillgängliga och hur man använder dem. 
Se till att du ersätter `<repository-url>`, `<din_mongodb_connection_string>`, och `<din_jwt_secret_key>` med dina faktiska värden i instruktionerna.