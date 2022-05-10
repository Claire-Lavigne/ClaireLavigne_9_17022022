# Init Project

### Back

- `cd Billed-app-FR-Back/`
- `npm i`
- `npm run run:dev` (mac) ou `npm run dev` (windows)
- adresse de l'API : `http://localhost:5678`

### Front

- `cd Billed-app-FR-Front/`
- `npm i`
- `npm install -g live-server`
- `live-server`
- lancer l'app : `http://127.0.0.1:8080/`

Vous pouvez vous connecter en utilisant les comptes:

#### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```

#### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### Run tests

- `cd Billed-app-FR-Front/`
- `npm run test`
- ou pour lancer un seul test :
  - `npm i -g jest-cli`
  - `jest src/__tests__/your_test_file.js`
- couverture de tests : `http://127.0.0.1:8080/coverage/lcov-report/`
