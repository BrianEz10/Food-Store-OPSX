# 1. Clonar el repo
git clone <url-del-repo>
cd Food-Store

# 2. Copiar .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Iniciar todo
docker compose up -d --build

# 4. Sembrar datos (imágenes, categorías, ingredientes, productos, usuarios)
docker compose exec backend python scripts/seed_full.py
El script de seed crea todo automáticamente: 9 categorías, 28 ingredientes, 18 productos con imágenes, 5 usuarios de prueba con sus roles. Está en backend/scripts/seed_full.py para que lo commiten al repo.