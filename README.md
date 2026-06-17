# 1. Clonar el repositorio


git clone https://github.com/BrianEz10/Food-Store-OPSX.git

cd Food-Store-OPSX

# 2. Configurar variables de entorno


cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env


# 3. Iniciar los servicios

docker compose up -d

La primera vez va a descargar las imágenes y demora unos minutos.

# 4. Cargar datos de prueba

Una vez que los contenedores estén levantados, ejecutá:

docker compose exec backend python scripts/seed_full.py


Esto crea automáticamente:
- **9 categorías**
- **28 ingredientes**
- **18 productos**
- **5 usuarios** (admin, stock, cajero, cocina, cliente)

## Acceder a la aplicación

- **Frontend:** http://localhost:5173


## Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@gmail.com | Admin12345 | Administrador |
| stock@test.com | Test1234! | Stock |
| cajero@test.com | Test1234! | Cajero |
| cocina@test.com | Test1234! | Cocina |
| cliente@test.com | Test1234! | Cliente |