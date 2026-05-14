## AUTH — Públicos (no requieren token)

### POST /auth/register

{

  "firstName": "Juan",

  "lastName": "Perez",

  "username": "juanp",

  "email": "juan@example.com",

  "password": "mipassword123"

}

Respuesta 201:

{

  "accessToken": "eyJ...",

  "refreshToken": "uuid-v4..."

}

---

### POST /auth/login

{

  "email": "juan@example.com",

  "password": "mipassword123"

}

Respuesta 200:

{

  "accessToken": "eyJ...",

  "refreshToken": "uuid-v4..."

}

---

### POST /auth/refresh

{

  "refreshToken": "uuid-v4-del-refresh-token"

}

Respuesta 200: igual que login (nuevo par de tokens, el anterior queda invalidado)

---

### POST /auth/logout

{

  "refreshToken": "uuid-v4-del-refresh-token"

}

Respuesta 204: sin body

---

## USERS — Requieren Authorization: Bearer `<accessToken>`

### GET /users/me

Sin body.

Respuesta 200: datos del usuario logueado (sin passwordHash)

---

### PATCH /users/me

{

  "firstName": "Juancito",

  "lastName": "Lopez",

  "username": "juancito"

}

Todos los campos son opcionales.

Respuesta 200: usuario actualizado

**
