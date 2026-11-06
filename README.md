# Lukie Keuning — architectuurportfolio

Een volledig lokale, tweetalige portfolio met een eigen SVG-architectuurstudie. Nederlands is standaard. Alle code, identifiers, codecomments en tests zijn Engels. Alle inhoud staat in twee JSON-bestanden: `src/data/nl.json` voor Nederlands en `src/data/en.json` voor Engels. Elk bestand bevat zowel de persoonlijke informatie als de vaste interfaceteksten.

## Lokaal ontwikkelen

Gebruik **Node.js 22.23.2** en npm. De versie staat in `.nvmrc` en `package.json`. Met nvm-windows:

```powershell
nvm install 22.23.2
nvm use 22.23.2
npm ci
npm run dev
```

Open http://localhost:3000. Als `node` niet wordt gevonden, activeer de versie met nvm en open een nieuwe terminal.

```powershell
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

De browsertests starten zelf een statische preview op poort 3100, zodat een developmentserver op poort 3000 de controle niet beïnvloedt. Hiervoor moet `out/` eerst zijn gebouwd. Met de omgevingsvariabele `PORT` kun je de testpoort overschrijven. Op Linux kan `npx playwright install --with-deps chromium` nodig zijn.

Voor handmatig bekijken van de productieversie:

```powershell
npm run build
npm run preview
```

De export staat in `out/`. `next start` wordt niet gebruikt: deze website heeft geen productieserver nodig. `npm run format` formatteert het project.

De exacte dependencyversies staan in `package-lock.json`. Next.js 16, React 19, TypeScript 6 en Tailwind 4 worden binnen hun majorversie vastgehouden. TypeScript 6 wordt daadwerkelijk gebruikt, zonder compatibiliteitsuitzondering. Geist wordt vanuit een meegeleverd WOFF2-bestand geladen, zonder externe fontrequests. De fontlicentie staat in `public/fonts/LICENSE.txt`.

## Inhoud aanpassen in twee JSON-bestanden

Open **`src/data/nl.json`** voor Nederlands en **`src/data/en.json`** voor Engels. Dit zijn de enige bestanden die je voor de website-inhoud hoeft te wijzigen. Beide hebben dezelfde indeling:

```json
{
  "profile": {
    "personal": {},
    "about": {},
    "education": [],
    "qualifications": [],
    "experience": [],
    "skills": [],
    "projects": [],
    "interests": [],
    "contact": {},
    "assets": {}
  },
  "ui": {}
}
```

Dit is een overzicht van de structuur; behoud de bestaande velden bij het invullen. Onder `profile` staan alle persoonlijke gegevens, contactopties en assetpaden. Onder `ui` staan vaste teksten zoals navigatie, sectietitels, knoplabels en toegankelijkheidslabels.

Teksten zijn gewone strings in de taal van het bestand, zonder geneste `nl`- of `en`-objecten. Gebruik Engelse veldnamen in beide bestanden. Vertaal de waarden in `en.json`. Houd ids, datums, contactgegevens en bestandspaden in beide bestanden gelijk wanneer ze naar dezelfde informatie verwijzen. Voeg nieuwe projecten, opleidingen en ervaringen in beide bestanden toe, met dezelfde unieke `id`. Lijsten mogen bewust per taal verschillen; de website toont de inhoud van de gekozen taal.

JSON gebruikt dubbele aanhalingstekens, geen comments en geen komma na het laatste veld. Voor een regeleinde in een tekst gebruik je `\n`. Laat onbekende teksten `""`, onbekende lijsten `[]` en een nog lopende baan `"end": null`. Gebruik geen verzonnen informatie als opvulling. De TypeScript-types in `src/types/profile.ts` en `src/data/content.ts` controleren de inhoud bij `npm run typecheck` en de build.

### Naam, titel, beschrijvingen en locatie

Pas `profile.personal.name`, `initials`, `title`, `location` en `introduction` aan. De Nederlandse titel en introductie worden ook voor de statische SEO-metadata gebruikt. In `en.json` staat bijvoorbeeld `"title": "Built Environment Student"` en in `nl.json` `"title": "Student Bouwkunde"`.

`profile.personal.availability` verschijnt alleen als het is ingevuld. De uitgebreidere biografie en motivatie staan in `profile.about.biography` en `profile.about.motivation`.

### Werkervaring

Voeg aan `profile.experience` een object toe in de gewenste volgorde. Voorbeeld voor `nl.json`:

```json
{
  "id": "unique-employer-period",
  "company": "Bedrijfsnaam",
  "role": "Functietitel",
  "type": "Parttime",
  "start": "2026-10",
  "end": null,
  "location": "Den Haag",
  "workMode": "Op locatie",
  "description": "",
  "skills": [],
  "propertyRelated": false
}
```

Voeg dezelfde entry met vertaalde teksten aan `en.json` toe. Datums voor werkervaring zijn `YYYY-MM`. `end: null` betekent heden; een ingevulde einddatum betekent afgerond. De Vinsa-stage loopt vanaf augustus 2026 en heeft `"end": null`. De laatste Avonturia-periode loopt van augustus 2024 tot en met augustus 2026. De werkervaring staat van recent naar oud. De twee Avonturia-periodes blijven afzonderlijke entries. `propertyRelated` geeft een subtiel vastgoedaccent, zonder werkzaamheden te suggereren.

### Opleidingen

Voeg aan `profile.education` een object toe met `id`, `institution`, `degree`, `start`, `end`, `expectedEnd`, `ongoing`, `description` en `specializations`. Teksten zijn strings; `specializations` is een lijst strings. Gebruik `end` voor een bekende afronding en `expectedEnd` voor een verwachte afronding; laat onbekende waarden leeg. Opleidingsdatums mogen `YYYY` of `YYYY-MM` zijn: voeg geen onbekende maanden toe. `expectedEnd` wordt alleen ingevuld expliciet als verwachte afronding getoond. De eerste opleiding verschijnt ook bij de introductie.

### Diploma’s en certificaten

`profile.qualifications` bevat behaalde diploma’s en certificaten met `id`, `name` en `date`. Gebruik voor `date` alleen de bekende nauwkeurigheid: `YYYY`, `YYYY-MM` of `YYYY-MM-DD`; een onbekende datum blijft leeg. Deze lijst verschijnt bij de opleidingen, ook wanneer de opleidingenlijst leeg is. Items met een lege naam blijven verborgen. Een behaald certificaat zegt niets over de actuele geldigheid; vul geen vervaldatum of geldigheidsclaim in zonder bevestiging.

### Vaardigheden en interesses

Voeg strings toe aan `profile.skills` onder de juiste categorie, bijvoorbeeld `"items": ["Bevestigde vaardigheid"]`. Vertaal de items en categorienaam in het Engelse bestand. Lege categorieën blijven verborgen. Er worden geen percentages of niveaus afgeleid. `profile.interests` is eveneens een lijst strings.

### Projecten en foto's

Zet afbeeldingen in `public/images/projects/`. Voeg vervolgens aan `profile.projects` in beide bestanden een project toe. Voorbeeld voor `nl.json`:

```json
{
  "id": "unique-study-project",
  "title": "Projecttitel",
  "description": "Feitelijke projectbeschrijving",
  "year": "2027",
  "category": "Studieproject",
  "cover": "images/projects/project-cover.webp",
  "images": [
    {
      "src": "images/projects/project-plan.webp",
      "alt": "Beschrijving van de plattegrond"
    }
  ],
  "tools": [],
  "url": ""
}
```

Dit is uitsluitend een invulvoorbeeld. Vul alleen werkelijk gebruikte technieken in bij `tools`. Een project met een titel verschijnt automatisch in de gallery en voegt de projectnavigatie toe. De detailweergave gebruikt een native dialoog met focusbeheer, Escape om te sluiten en terugkeer naar de opener. Een lege cover krijgt een architecturale fallback. Externe links verschijnen alleen bij een geldige HTTP(S)-URL.

Gebruik bij voorkeur WebP of AVIF, passende afmetingen en beschrijvende alt-teksten in beide talen. Externe afbeeldingen moeten als volledige HTTPS-URL worden opgegeven. Lokale assetpaden bevatten het woord `public` niet. Het hosting-subpad wordt automatisch toegevoegd.

### Contact, LinkedIn, profielfoto en CV

- Vul `profile.contact.email`, `phone` en/of `linkedin` in beide bestanden in. Gebruik voor LinkedIn de volledige HTTPS-profiel-URL. Lege opties verschijnen niet. Er is geen contactformulier of backend.
- Zet de profielfoto in `public/images/profile/` en vul `profile.assets.profileImage` in, bijvoorbeeld `"images/profile/lukie.webp"`. Vul `profile.assets.profileImageAlt` in met een beschrijvende tekst in de juiste taal. De meegeleverde foto is geoptimaliseerd naar `public/images/profile/lukie-keuning.webp` (1400 × 1120 pixels, circa 52 kB), met behoud van de beeldverhouding. Zonder foto blijft de architecturale SVG-fallback zichtbaar.
- Plaats het echte CV in `public/cv/` en zet `profile.assets.cvFile` in beide bestanden op bijvoorbeeld `"cv/lukie-keuning.pdf"`. De download werkt dan automatisch, ook onder een repository-subpad. Zonder ingevuld bestand blijft de knop uitgeschakeld. Het meegeleverde originele CV staat ongewijzigd op `public/cv/lukie-keuning.pdf`. Let op: dit downloadbare bestand bevat nog het volledige woonadres, een leeftijd, studiejaar en stagezoektocht uit de oorspronkelijke profieltekst. Deze worden op de webpagina niet als actuele informatie gepresenteerd.

### Automatische zichtbaarheid en interfaceteksten

Projecten, ervaring, opleiding en interesses verschijnen zodra er inhoud is. Lege vaardigheidscategorieën blijven verborgen. Contact verschijnt bij contactinformatie of een CV. De navigatie volgt de zichtbaarheid van de gekozen taal. Over mij blijft beschikbaar met de bekende basisgegevens. Lege biografie, motivatie, beschikbaarheid en ervaringsbeschrijvingen blijven weg.

Pas vaste teksten aan onder `ui` in beide JSON-bestanden. De taalwisselaar bewaart de voorkeur onder `lk-language`; het thema onder `lk-theme`. Geblokkeerde browseropslag verhindert het gebruik niet. De statische HTML bevat de Nederlandse inhoud al. Een eerder gekozen Engelse taal wordt na hydration toegepast; op een trage verbinding kan kort Nederlands zichtbaar zijn. Het thema wordt vóór de eerste weergave uitgelezen.

`src/data/profile.ts` en `src/i18n/translations.ts` zijn uitsluitend technische koppelingen naar de JSON-bestanden; hierin hoef je geen inhoud meer te bewerken. Na wijzigingen kun je `npm run typecheck`, `npm test` en `npm run build` uitvoeren.

## Vormgeving en toegankelijkheid

De hero bevat een eigen conceptuele gebouwtekening, expliciet aangeduid als illustratie en niet als eigen project. Raster, hulplijnen, constructie, gevel, dak en maatvoering verschijnen gefaseerd. Je kunt wisselen naar een ingekleurde gebouwweergave en de opbouw opnieuw starten. Hoverlabels en subtiele muisparallax zijn aanvullend; de knoppen werken ook op touchscreens. Bij `prefers-reduced-motion` worden animaties en parallax uitgeschakeld. Zonder JavaScript staat de Nederlandse basisinhoud met de SVG in de export.

De site bevat een skiplink, focusstijlen, mobiele navigatie, semantische secties en een native projectdialoog. Het lichte en donkere thema gebruiken dezelfde CSS-variabelen. Er worden geen stockfoto's, fictieve projecten of onbewezen softwarevaardigheden gebruikt.

## Later publiceren op GitHub Pages

Er is nog geen repository ingesteld, geen remote toegevoegd en niets extern gepubliceerd.

1. Maak Lukies GitHub-account aan.
2. Maak een lege repository. Voor een persoonlijke site heet deze exact `<gebruikersnaam>.github.io`. Voor een projectsite kies je zelf een naam, bijvoorbeeld `portfolio`.
3. Open een terminal in dit project en koppel de echte repository. Vervang de placeholders eerst:

```powershell
git init
git add .
git commit -m "Build architecture portfolio"
git branch -M main
git remote add origin https://github.com/<gebruikersnaam>/<repository>.git
git push -u origin main
```

4. Kies in de repository **Settings → Pages → Source → GitHub Actions**.
5. Bekijk onder **Actions** de workflow `Deploy portfolio to GitHub Pages`. Als de eerste push eerder is gedaan, start deze opnieuw met **Run workflow**.
6. De workflow installeert Node via `.nvmrc`, voert controles en unit tests uit, bouwt `out/`, test de export in Chromium en publiceert met de officiële Pages Actions.
7. De uiteindelijke URL verschijnt bij de deployment en onder Settings → Pages.

Persoonlijke site: `https://<gebruikersnaam>.github.io/`.
Projectsite: `https://<gebruikersnaam>.github.io/<repository>/`.

De build leest in GitHub Actions `GITHUB_REPOSITORY`. Eindigt de repositorynaam op `.github.io`, dan blijft `basePath` leeg. Anders wordt de repositorynaam het subpad. Lokaal blijft het pad standaard leeg, ook als een shell toevallig `GITHUB_REPOSITORY` bevat. `.nojekyll` zorgt dat Pages de `_next`-assets serveert.

Latere wijzigingen publiceer je met een commit en push naar `main`:

```powershell
git add .
git commit -m "Update portfolio content"
git push
```

### Subpaden testen en overschrijven

Voor een lokale proef met een projectrepository:

```powershell
$env:SITE_BASE_PATH = "/portfolio"
npm run build
npm run test:e2e
npm run preview
```

Open http://localhost:3000/portfolio/. De browsertests gebruiken een eigen preview op poort 3100.

Terug naar de normale lokale configuratie:

```powershell
Remove-Item Env:SITE_BASE_PATH
npm run build
```

`SITE_BASE_PATH` overschrijft de automatische detectie; een expliciete lege waarde geeft een root-deployment. Voor een afwijkende externe deployment kun je deze omgevingsvariabele ook in de buildworkflow zetten. Gebruik alleen een pad, geen volledige URL. Als je de workflow aanpast, geef hetzelfde pad door aan de browser-teststap.

Bij kapotte assets: controleer of je de juiste URL mét subpad opent, of de build het juiste `SITE_BASE_PATH` gebruikt en of profielpaden naar werkelijk bestaande bestanden verwijzen. Voeg het subpad niet handmatig aan profielpaden toe. Fonts via `next/font/local`, favicon, afbeeldingen en CV gebruiken de buildconfiguratie. Bij een verkeerde Pages-instelling controleer je eerst de logs van de workflow en de geselecteerde deploymentbron.

## Structuur

```text
src/app/                 Layout, metadata, pagina, 404 en CSS
src/components/          Portfoliosecties en interactieve SVG
src/context/             Taal- en themavoorkeur
src/data/nl.json         Alle Nederlandse inhoud (profile en ui)
src/data/en.json         Alle Engelse inhoud (profile en ui)
src/data/content.ts      Getypeerde JSON-koppeling
src/data/profile.ts      Profielselectie per taal
src/i18n/translations.ts Interfaceteksten uit de JSON-bestanden
src/lib/                 Paden, datums en zichtbaarheid
src/types/               Profieltypes
public/                  Lokale fonts, favicon, profielfoto en origineel CV
scripts/preview.mjs      Lokale statische server
tests/unit/              Node.js Test Runner
tests/e2e/               Playwright desktop en mobiel
.github/workflows/       Voorbereide GitHub Pages-deployment
```

## Nog in te vullen

LinkedIn-URL, beschikbaarheid, projecten, bouwkundige vaardigheden, softwarekennis en overige interesses zijn nog onbekend. Ze zijn bewust leeg. De bouwkundige belangstelling staat bij Over mij; creativiteit, communicatie en samenwerken zijn daar als zelfbeschrijving verwoord. Havo N&T (2019–2024), de propedeuse (2025), Nederlands 4F (2026), VOL-VCA (23 maart 2026), contactgegevens, werkplekken, foto en CV zijn aangevuld uit het aangeleverde materiaal. Het CV vermeldt geen afzonderlijk behaald havodiploma: dat wordt niet afgeleid uit de opleidingsperiode. De verwachte afstudeerdatum en twee afzonderlijke Avonturia-periodes zijn behouden. De werkervaringsdatums zijn bijgewerkt op basis van de aangeleverde LinkedIn-screenshot: Vinsa augustus 2026–heden, Avonturia augustus 2024–augustus 2026, Cardia juni–augustus 2024 en Avonturia mei 2022–juni 2024. Het originele downloadbare CV blijft ongewijzigd en bevat de oudere tijdlijn. De stagebeschrijving kan later worden toegevoegd zonder componentcode te wijzigen. Bestanden moeten daadwerkelijk worden toegevoegd; de site kan het bestaan van toekomstige assetpaden niet vooraf garanderen.
