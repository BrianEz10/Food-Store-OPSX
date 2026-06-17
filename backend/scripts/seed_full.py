"""
Seed script — crea categorías, ingredientes, productos con imágenes.
Ejecutar estando el backend corriendo:

    docker compose exec backend python scripts/seed_full.py

Requiere que ./imagenesProductos/ esté montado en /app/imagenesProductos/
(ya configurado en docker-compose.yml).
"""

import json, os, uuid
from urllib.request import Request, urlopen
from urllib.error import HTTPError

BASE = "http://localhost:8000/api/v1"
IMG_DIR = "/app/imagenesProductos"

def api(method, path, data=None, files=None):
    url = f"{BASE}{path}"
    headers = {"Authorization": f"Bearer {TOKEN}"}
    if files:
        import io
        body, boundary = encode_multipart(files)
        headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
        req = Request(url, data=body, headers=headers, method=method)
    else:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode() if data else None
        req = Request(url, data=body, headers=headers, method=method)
    try:
        with urlopen(req) as r:
            return json.loads(r.read())
    except HTTPError as e:
        body = e.read().decode()
        print(f"  ERROR {method} {path}: {e.code} {body[:100]}")
        return None

def encode_multipart(files):
    import uuid
    boundary = uuid.uuid4().hex
    body = b""
    for name, filename, filedata, mimetype in files:
        body += f"--{boundary}\r\n".encode()
        body += f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode()
        body += f"Content-Type: {mimetype}\r\n\r\n".encode()
        body += filedata + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    return body, boundary

def upload_img(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, "rb") as f:
        data = f.read()
    ext = filename.rsplit(".", 1)[1].lower()
    mimetype = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg"}.get(ext, "image/png")
    result = api("POST", "/uploads/imagen", files=[("file", filename, data, mimetype)])
    return result["secure_url"] if result else None

# ── Login ──────────────────────────────────────────────────────────────
print("=== Iniciando sesión ===")
try:
    req = Request(f"{BASE}/auth/login", data=json.dumps({"email":"admin@foodstore.com","password":"Admin1234!"}).encode(),
                  headers={"Content-Type":"application/json"})
    with urlopen(req) as r:
        TOKEN = json.loads(r.read())["access_token"]
    print("  OK")
except Exception as e:
    print(f"  ERROR login: {e}")
    exit(1)

# ── Categorías ─────────────────────────────────────────────────────────
print("\n=== Categorías ===")
existing = api("GET", "/categorias/")
if existing and len(existing) > 4:
    print(f"  Ya existen {len(existing)} categorías, saltando...")
else:
    cats_def = [
        ("Bebidas", "Gaseosas, aguas, jugos", None),
        ("Gaseosas", "Bebidas carbonatadas", "Bebidas"),
        ("Aguas", "Agua mineral", "Bebidas"),
        ("Jugos", "Jugos naturales", "Bebidas"),
        ("Comidas", "Platos principales", None),
        ("Pastas", "Pastas artesanales", "Comidas"),
        ("Carnes", "Carnes rojas y aves", "Comidas"),
        ("Ensaladas", "Ensaladas frescas", "Comidas"),
        ("Postres", "Dulces y tentaciones", None),
    ]
    cat_map = {}
    for name, desc, parent in cats_def:
        payload = {"nombre": name, "descripcion": desc}
        if parent and parent in cat_map:
            payload["parent_id"] = cat_map[parent]["id"]
        r = api("POST", "/categorias/", data=payload)
        if r:
            cat_map[name] = r
            print(f"  ✓ {name}")
    existing = api("GET", "/categorias/")

cats = {c["nombre"]: c for c in (existing or [])}
print(f"  {len(cats)} categorías listas")

# ── Ingredientes ───────────────────────────────────────────────────────
print("\n=== Ingredientes ===")
existing_ings = api("GET", "/ingredientes/")
if existing_ings and len(existing_ings) > 20:
    print(f"  Ya existen {len(existing_ings)} ingredientes, saltando...")
    ings = {i["nombre"]: i["id"] for i in existing_ings}
else:
    ing_defs = [
        ("Agua","Agua purificada",False),("Azúcar","Azúcar refinada",False),("Gas","Gas carbónico",False),
        ("Harina de trigo","Harina de trigo refinada",True),("Huevo","Huevo fresco",True),
        ("Leche","Leche pasteurizada",True),("Carne picada","Carne vacuna picada",False),
        ("Queso","Queso muzzarella",True),("Tomate","Tomate perita",False),("Cebolla","Cebolla blanca",False),
        ("Laurel","Hoja de laurel",False),("Pollo","Pechuga de pollo",False),("Lechuga","Lechuga criolla",False),
        ("Palta","Palta fresca",False),("Limón","Limón fresco",False),("Naranja","Naranja jugosa",False),
        ("Maní","Maní salado",True),("Cacao","Cacao amargo",False),("Manteca","Manteca",False),
        ("Esencia de vainilla","Vainilla natural",False),("Frutilla","Frutilla fresca",False),
        ("Crema de leche","Crema de leche",False),("Ricota","Ricota cremosa",True),
        ("Espinaca","Espinaca fresca",False),("Salsa bolognesa","Salsa de tomate con carne",False),
        ("Salsa bechamel","Salsa blanca",False),("Salsa de tomate","Salsa de tomate",False),
        ("Parmesano","Queso parmesano",True),
    ]
    ings = {}
    for name, desc, al in ing_defs:
        r = api("POST", "/ingredientes/", data={"nombre":name,"descripcion":desc,"es_alergeno":al})
        if r:
            ings[name] = r["id"]
            print(f"  ✓ {name}")
    print(f"  {len(ings)} ingredientes creados")

# ── Imágenes ────────────────────────────────────────────────────────────
print("\n=== Imágenes ===")
if not os.path.isdir(IMG_DIR):
    print(f"  Directorio {IMG_DIR} no encontrado. Montaste ./imagenesProductos/ en docker-compose?")
    imgs = {}
else:
    imgs = {}
    for fname in sorted(os.listdir(IMG_DIR)):
        if not fname.endswith((".png",".jpg",".jpeg")): continue
        path = os.path.join(IMG_DIR, fname)
        name = fname.rsplit(".",1)[0]
        url = upload_img(path)
        if url:
            imgs[name] = url
            print(f"  ✓ {name}")
    print(f"  {len(imgs)} imágenes subidas")

# ── Productos ──────────────────────────────────────────────────────────
print("\n=== Productos ===")
existing_prods = api("GET", "/productos/?size=50")
if existing_prods and existing_prods["total"] > 15:
    print(f"  Ya existen {existing_prods['total']} productos, saltando...")
else:
    def ing_ref(n): return {"ingrediente_id":ings[n],"cantidad":1,"unidad_medida_id":1,"es_removible":False}
    def ing_rem(n): return {"ingrediente_id":ings[n],"cantidad":1,"unidad_medida_id":1,"es_removible":True}

    products = [
        ("Agua Mineral sin gas","Agua mineral natural sin gas 500ml",850,"Agua Mineral sin gas",["Aguas"],[ing_ref("Agua")]),
        ("Agua con gas","Agua mineral natural con gas 500ml",950,"Agua con gas",["Aguas"],[ing_ref("Agua"),ing_ref("Gas")]),
        ("Coca Cola","Gaseosa cola 500ml",1200,"Coca Cola",["Gaseosas"],[ing_ref("Agua"),ing_ref("Azúcar")]),
        ("Sprite","Gaseosa lima-limón 500ml",1200,"Sprite",["Gaseosas"],[ing_ref("Agua"),ing_ref("Limón")]),
        ("Jugo de naranja natural","Jugo de naranja natural 400ml",1500,"Jugo de naranja natural",["Jugos"],[ing_ref("Naranja")]),
        ("Jugo natural de limón","Jugo de limón natural 400ml",1300,"Jugo natural de limon",["Jugos"],[ing_ref("Limón")]),
        ("Maní salado","Maní salado tostado 100g",600,"Mani salado",["Bebidas"],[ing_ref("Maní")]),
        ("Lasaña clásica","Lasaña de carne con salsa bechamel, queso y jamón",4200,"Lasaña clasica",["Pastas"],[ing_ref("Harina de trigo"),ing_ref("Carne picada"),ing_rem("Queso"),ing_ref("Salsa bechamel"),ing_ref("Salsa de tomate")]),
        ("Ravioles de ricota","Ravioles artesanales de ricota y espinaca",3800,"Ravioles de ricota",["Pastas"],[ing_ref("Harina de trigo"),ing_ref("Ricota"),ing_rem("Espinaca"),ing_ref("Huevo")]),
        ("Tallarines a la bolognesa","Tallarines frescos con salsa bolognesa",3500,"Tallarines a la bolognesa",["Pastas"],[ing_ref("Harina de trigo"),ing_ref("Salsa bolognesa"),ing_rem("Parmesano")]),
        ("Bife de chorizo","Bife de chorizo 300g con guarnición",5800,"Bife de chorizo",["Carnes"],[ing_ref("Carne picada"),ing_rem("Cebolla")]),
        ("Pollo a la parrilla","Pechuga de pollo a la parrilla con vegetales",4200,"Pollo a la parilla",["Carnes"],[ing_ref("Pollo"),ing_rem("Lechuga"),ing_rem("Tomate")]),
        ("Ensalada mixta","Lechuga, tomate, cebolla y zanahoria",2200,"Ensalada mixta",["Ensaladas"],[ing_ref("Lechuga"),ing_rem("Tomate"),ing_rem("Cebolla")]),
        ("Ensalada César","Lechuga, pollo, croutons y parmesano",3200,"Ensalada Cesar",["Ensaladas"],[ing_ref("Lechuga"),ing_ref("Pollo"),ing_rem("Parmesano")]),
        ("Bowl de palta","Bowl veggie con palta, quinoa y vegetales",2800,"Bowl de palta",["Ensaladas"],[ing_ref("Palta"),ing_rem("Tomate"),ing_rem("Limón")]),
        ("Brownie de chocolate","Brownie de chocolate amargo con nueces",1800,"Brownie de chocolate",["Postres"],[ing_ref("Cacao"),ing_ref("Huevo"),ing_ref("Manteca"),ing_ref("Harina de trigo")]),
        ("Flan casero","Flan casero con dulce de leche",1500,"Flan casero",["Postres"],[ing_ref("Leche"),ing_ref("Huevo")]),
        ("Helado de frutilla","Helado artesanal de frutilla 2 bochas",1200,"Helado de frutilla",["Postres"],[ing_ref("Frutilla"),ing_ref("Leche"),ing_ref("Crema de leche")]),
    ]

    ok = 0
    for name, desc, price, img_key, cat_names, ing_list in products:
        payload = {
            "nombre": name, "descripcion": desc, "precio_base": price,
            "stock_cantidad": 100, "disponible": True,
            "imagenes_url": [imgs[img_key]] if img_key in imgs else None,
            "categorias": [{"categoria_id":cats[cn]["id"],"es_principal":i==0} for i,cn in enumerate(cat_names)],
            "ingredientes": ing_list,
        }
        r = api("POST", "/productos/", data=payload)
        if r: ok += 1; print(f"  ✓ {name}")
    print(f"  {ok} productos creados")

# ── Usuarios de prueba ──────────────────────────────────────────────────
print("\n=== Usuarios de prueba ===")
test_users = [
    ("stock@test.com", "Test1234!", "Stock", "Test", ["STOCK"]),
    ("pedidos@test.com", "Test1234!", "Pedidos", "Test", ["PEDIDOS"]),
    ("cajero@test.com", "Test1234!", "Cajero", "Test", ["CAJERO"]),
    ("cliente@test.com", "Test1234!", "Carlos", "Cliente", ["CLIENT"]),
]
for email, pw, nombre, apellido, roles in test_users:
    req = Request(f"{BASE}/auth/register", data=json.dumps({"email":email,"password":pw,"nombre":nombre,"apellido":apellido}).encode(),
                  headers={"Content-Type":"application/json"})
    try:
        with urlopen(req) as r:
            print(f"  ✓ {email} creado")
    except HTTPError as e:
        if e.code == 409:
            print(f"  - {email} ya existe")
        else:
            print(f"  ERROR {email}: {e.code}")

    # Assign roles
    # Find user ID
    users_resp = api("GET", "/usuarios/?size=50")
    if users_resp:
        for u in users_resp["items"]:
            if u["email"] == email:
                api("PATCH", f"/usuarios/{u['id']}/roles", data={"roles": roles})
                print(f"    → roles: {roles}")
                break

print(f"\n=== COMPLETADO ===")
total = api("GET", "/productos/?size=1")
print(f"  {total['total'] if total else 0} productos en total")
print(f"\nUsuarios de prueba:")
print(f"  Admin:  admin@foodstore.com / Admin1234!")
print(f"  Stock:  stock@test.com / Test1234!")
print(f"  Cajero:  cajero@test.com / Test1234!")
print(f"  Pedidos: pedidos@test.com / Test1234!")
print(f"  Cliente: cliente@test.com / Test1234!")
