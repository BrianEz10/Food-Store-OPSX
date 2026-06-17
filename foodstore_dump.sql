--
-- PostgreSQL database dump
--

\restrict 9IHAe9Bb5QMLUm5OgU4AZiA3jWhXgBn2Vk2g5pWlmmXVK6FgqYvZxP4YdLLbkmF

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    imagen_url character varying(500),
    padre_id integer,
    eliminado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    orden integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: configuracion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion (
    clave character varying(100) NOT NULL,
    valor text NOT NULL,
    descripcion text,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.configuracion OWNER TO postgres;

--
-- Name: detalles_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_pedido (
    id integer NOT NULL,
    pedido_id integer NOT NULL,
    producto_id integer NOT NULL,
    nombre_snapshot character varying(200) NOT NULL,
    precio_snapshot numeric(10,2) NOT NULL,
    cantidad integer NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    personalizacion integer[],
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_detalle_cantidad_minima CHECK ((cantidad >= 1))
);


ALTER TABLE public.detalles_pedido OWNER TO postgres;

--
-- Name: detalles_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_pedido_id_seq OWNER TO postgres;

--
-- Name: detalles_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_pedido_id_seq OWNED BY public.detalles_pedido.id;


--
-- Name: direcciones_entrega; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.direcciones_entrega (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    alias character varying(50),
    linea1 text NOT NULL,
    linea2 text,
    ciudad character varying(100) NOT NULL,
    codigo_postal character varying(10) NOT NULL,
    es_principal boolean DEFAULT false NOT NULL,
    eliminado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.direcciones_entrega OWNER TO postgres;

--
-- Name: direcciones_entrega_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.direcciones_entrega_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.direcciones_entrega_id_seq OWNER TO postgres;

--
-- Name: direcciones_entrega_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.direcciones_entrega_id_seq OWNED BY public.direcciones_entrega.id;


--
-- Name: estados_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados_pedido (
    codigo character varying(20) NOT NULL,
    descripcion character varying(100) NOT NULL,
    orden integer NOT NULL,
    es_terminal boolean NOT NULL
);


ALTER TABLE public.estados_pedido OWNER TO postgres;

--
-- Name: formas_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formas_pago (
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    habilitado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.formas_pago OWNER TO postgres;

--
-- Name: historial_estados_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_estados_pedido (
    id integer NOT NULL,
    pedido_id integer NOT NULL,
    estado_desde character varying(20),
    estado_hasta character varying(20) NOT NULL,
    usuario_id integer,
    motivo text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.historial_estados_pedido OWNER TO postgres;

--
-- Name: historial_estados_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_estados_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_estados_pedido_id_seq OWNER TO postgres;

--
-- Name: historial_estados_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_estados_pedido_id_seq OWNED BY public.historial_estados_pedido.id;


--
-- Name: ingredientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredientes (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    es_alergeno boolean DEFAULT false NOT NULL,
    eliminado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    descripcion text
);


ALTER TABLE public.ingredientes OWNER TO postgres;

--
-- Name: ingredientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredientes_id_seq OWNER TO postgres;

--
-- Name: ingredientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredientes_id_seq OWNED BY public.ingredientes.id;


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    pedido_id integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    mp_payment_id bigint,
    mp_status character varying(30) NOT NULL,
    external_reference character varying(100) NOT NULL,
    idempotency_key character varying(100) NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    estado_codigo character varying(20) NOT NULL,
    direccion_id integer,
    forma_pago_codigo character varying(20),
    total numeric(10,2) DEFAULT 0 NOT NULL,
    costo_envio numeric(10,2) DEFAULT 50.00 NOT NULL,
    direccion_snapshot jsonb,
    notas text,
    eliminado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_pedido_envio_positivo CHECK ((costo_envio >= (0)::numeric)),
    CONSTRAINT ck_pedido_total_positivo CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_id_seq OWNER TO postgres;

--
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    imagen_url character varying(500),
    precio_base numeric(10,2) DEFAULT 0 NOT NULL,
    stock_cantidad integer DEFAULT 0 NOT NULL,
    disponible boolean DEFAULT true NOT NULL,
    eliminado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_producto_precio_positivo CHECK ((precio_base >= (0)::numeric)),
    CONSTRAINT ck_producto_stock_positivo CHECK ((stock_cantidad >= 0))
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- Name: productos_categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos_categorias (
    producto_id integer NOT NULL,
    categoria_id integer NOT NULL,
    es_principal boolean DEFAULT false NOT NULL
);


ALTER TABLE public.productos_categorias OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: productos_ingredientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos_ingredientes (
    producto_id integer NOT NULL,
    ingrediente_id integer NOT NULL,
    es_removible boolean NOT NULL
);


ALTER TABLE public.productos_ingredientes OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    usuario_id integer NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    codigo character varying(20) NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    email character varying(254) NOT NULL,
    password_hash character varying(60) NOT NULL,
    telefono character varying(20),
    eliminado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: usuarios_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_roles (
    usuario_id integer NOT NULL,
    rol_codigo character varying(20) NOT NULL,
    asignado_por_id integer,
    creado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios_roles OWNER TO postgres;

--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: detalles_pedido id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido ALTER COLUMN id SET DEFAULT nextval('public.detalles_pedido_id_seq'::regclass);


--
-- Name: direcciones_entrega id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direcciones_entrega ALTER COLUMN id SET DEFAULT nextval('public.direcciones_entrega_id_seq'::regclass);


--
-- Name: historial_estados_pedido id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_pedido ALTER COLUMN id SET DEFAULT nextval('public.historial_estados_pedido_id_seq'::regclass);


--
-- Name: ingredientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredientes ALTER COLUMN id SET DEFAULT nextval('public.ingredientes_id_seq'::regclass);


--
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
4a5b6c7d8e9f
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nombre, descripcion, imagen_url, padre_id, eliminado_en, creado_en, actualizado_en, orden) FROM stdin;
1	Gaseosas	de todo	\N	\N	2026-05-20 09:11:14.09755-03	2026-05-20 09:00:29.877782-03	2026-05-20 09:11:14.060561-03	2
2	pastas	de too	\N	\N	2026-05-20 09:11:16.381842-03	2026-05-20 09:00:53.411423-03	2026-05-20 09:11:16.371242-03	1
3	vinos	de toos	\N	\N	2026-05-20 09:11:18.097968-03	2026-05-20 09:01:06.548283-03	2026-05-20 09:11:18.077119-03	0
4	Bebidas	Gaseosas, aguas, jugos y bebidas en general	\N	\N	\N	2026-05-20 09:12:12.524409-03	2026-05-20 09:12:12.524438-03	0
5	Gaseosas	Bebidas carbonatadas y sodas	\N	4	\N	2026-05-20 09:12:12.642898-03	2026-05-20 09:12:12.642921-03	0
6	Aguas	Agua mineral con y sin gas	\N	4	\N	2026-05-20 09:12:12.67999-03	2026-05-20 09:12:12.680062-03	0
7	Jugos	Jugos naturales y envasados	\N	4	\N	2026-05-20 09:12:12.722316-03	2026-05-20 09:12:12.722348-03	0
8	Comidas	Platos preparados y comidas en general	\N	\N	\N	2026-05-20 09:12:12.756252-03	2026-05-20 09:12:12.756271-03	0
9	Pastas	Fideos, ravioles, lasañas y pastas frescas	\N	8	\N	2026-05-20 09:12:12.852699-03	2026-05-20 09:12:12.852726-03	0
10	Carnes	Carne vacuna, pollo, cerdo y parrilla	\N	8	\N	2026-05-20 09:12:12.882377-03	2026-05-20 09:12:12.882398-03	0
11	Ensaladas	Ensaladas frescas y bowls saludables	\N	8	\N	2026-05-20 09:12:12.912905-03	2026-05-20 09:12:12.912926-03	0
12	Snacks	Picadas, papas fritas, frutos secos y bocaditos	\N	\N	\N	2026-05-20 09:12:19.104045-03	2026-05-20 09:12:19.104075-03	0
13	Postres	Dulces, helados, tortas y reposteria	\N	\N	\N	2026-05-20 09:12:19.131197-03	2026-05-20 09:12:19.13123-03	0
\.


--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion (clave, valor, descripcion, actualizado_en) FROM stdin;
\.


--
-- Data for Name: detalles_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_pedido (id, pedido_id, producto_id, nombre_snapshot, precio_snapshot, cantidad, subtotal, personalizacion, creado_en) FROM stdin;
\.


--
-- Data for Name: direcciones_entrega; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.direcciones_entrega (id, usuario_id, alias, linea1, linea2, ciudad, codigo_postal, es_principal, eliminado_en, creado_en, actualizado_en) FROM stdin;
2	2	El raton	Mi casa	\N	Mendoza	0000	t	\N	2026-05-20 17:14:31.808785-03	2026-05-20 17:14:31.808811-03
\.


--
-- Data for Name: estados_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados_pedido (codigo, descripcion, orden, es_terminal) FROM stdin;
PENDIENTE	Pedido creado, esperando pago	1	f
CONFIRMADO	Pago aprobado, listo para preparar	2	f
EN_PREP	En preparación	3	f
EN_CAMINO	En camino al cliente	4	f
ENTREGADO	Entregado al cliente	5	t
CANCELADO	Pedido cancelado	6	t
\.


--
-- Data for Name: formas_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formas_pago (codigo, nombre, habilitado) FROM stdin;
MERCADOPAGO	MercadoPago	t
EFECTIVO	Efectivo al recibir	t
TRANSFERENCIA	Transferencia bancaria	t
\.


--
-- Data for Name: historial_estados_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_estados_pedido (id, pedido_id, estado_desde, estado_hasta, usuario_id, motivo, creado_en) FROM stdin;
\.


--
-- Data for Name: ingredientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredientes (id, nombre, es_alergeno, eliminado_en, creado_en, actualizado_en, descripcion) FROM stdin;
1	Carne vacuna	f	\N	2026-05-20 09:14:51.758813-03	2026-05-20 09:14:51.758838-03	Carne de res para milanesas, bifes y hamburguesas
2	Pollo	f	\N	2026-05-20 09:14:51.793578-03	2026-05-20 09:14:51.793615-03	Pechuga y pata de pollo fresco
3	Cerdo	f	\N	2026-05-20 09:14:51.831809-03	2026-05-20 09:14:51.831831-03	Carne de cerdo para bondiola y costillas
4	Chorizo	f	\N	2026-05-20 09:14:51.8592-03	2026-05-20 09:14:51.85922-03	Chorizo criollo para parrilla
5	Queso	t	\N	2026-05-20 09:14:51.89545-03	2026-05-20 09:14:51.895763-03	Queso muzzarella, parmesano y tybo
6	Crema	t	\N	2026-05-20 09:14:51.925277-03	2026-05-20 09:14:51.925297-03	Crema de leche para pastas y salsas
7	Manteca	t	\N	2026-05-20 09:14:51.957605-03	2026-05-20 09:14:51.957625-03	Manteca pasteurizada
8	Leche	t	\N	2026-05-20 09:14:51.993369-03	2026-05-20 09:14:51.99339-03	Leche entera fresca
9	Huevo	t	\N	2026-05-20 09:14:52.024069-03	2026-05-20 09:14:52.024124-03	Huevo fresco de granja
10	Tomate	f	\N	2026-05-20 09:14:52.053936-03	2026-05-20 09:14:52.05396-03	Tomate perita y redondo fresco
11	Cebolla	f	\N	2026-05-20 09:14:52.080414-03	2026-05-20 09:14:52.080446-03	Cebolla blanca y colorada
12	Ajo	f	\N	2026-05-20 09:14:52.110325-03	2026-05-20 09:14:52.110369-03	Ajo fresco
13	Lechuga	f	\N	2026-05-20 09:14:52.139932-03	2026-05-20 09:14:52.139964-03	Lechuga criolla y mantecosa
14	Zanahoria	f	\N	2026-05-20 09:14:52.171296-03	2026-05-20 09:14:52.171321-03	Zanahoria fresca
15	Pepino	f	\N	2026-05-20 09:14:52.192412-03	2026-05-20 09:14:52.192437-03	Pepino fresco
16	Espinaca	f	\N	2026-05-20 09:14:52.225475-03	2026-05-20 09:14:52.2255-03	Espinaca fresca
17	Palta	f	\N	2026-05-20 09:14:52.257851-03	2026-05-20 09:14:52.257878-03	Palta madura
18	Aceitunas	f	\N	2026-05-20 09:14:52.291895-03	2026-05-20 09:14:52.291923-03	Aceitunas verdes y negras
19	Papa	f	\N	2026-05-20 09:14:52.324574-03	2026-05-20 09:14:52.324604-03	Papa blanca para freír y hervir
20	Sal	f	\N	2026-05-20 09:14:52.359485-03	2026-05-20 09:14:52.359504-03	Sal fina y parrillera
21	Pimienta	f	\N	2026-05-20 09:14:52.389417-03	2026-05-20 09:14:52.389445-03	Pimienta negra molida
22	Aceite	f	\N	2026-05-20 09:14:52.423852-03	2026-05-20 09:14:52.42388-03	Aceite de oliva y girasol
23	Orégano	f	\N	2026-05-20 09:14:52.458041-03	2026-05-20 09:14:52.458064-03	Orégano seco
24	Perejil	f	\N	2026-05-20 09:14:52.501454-03	2026-05-20 09:14:52.501476-03	Perejil fresco
25	Laurel	f	\N	2026-05-20 09:14:52.525904-03	2026-05-20 09:14:52.525924-03	Hoja de laurel
26	Harina	t	\N	2026-05-20 09:14:52.55393-03	2026-05-20 09:14:52.553953-03	Harina de trigo 0000
27	Pasta seca	t	\N	2026-05-20 09:14:52.585542-03	2026-05-20 09:14:52.585568-03	Fideos secos de sémola
28	Pasta fresca	t	\N	2026-05-20 09:14:52.611409-03	2026-05-20 09:14:52.611439-03	Pasta fresca artesanal
29	Salsa de tomate	f	\N	2026-05-20 09:14:52.639685-03	2026-05-20 09:14:52.639707-03	Salsa de tomate natural
30	Ricota	t	\N	2026-05-20 09:14:52.672822-03	2026-05-20 09:14:52.672844-03	Ricota fresca
31	Maíz	f	\N	2026-05-20 09:14:52.699637-03	2026-05-20 09:14:52.699659-03	Maíz para pochoclo
32	Cacahuate	t	\N	2026-05-20 09:14:52.734816-03	2026-05-20 09:14:52.734851-03	Maní tostado
33	Almendra	t	\N	2026-05-20 09:14:52.781464-03	2026-05-20 09:14:52.781496-03	Almendras peladas
34	Chocolate	t	\N	2026-05-20 09:14:52.820688-03	2026-05-20 09:14:52.820712-03	Chocolate amargo y con leche
35	Dulce de leche	t	\N	2026-05-20 09:14:52.857531-03	2026-05-20 09:14:52.857557-03	Dulce de leche artesanal
36	Vainilla	f	\N	2026-05-20 09:14:52.893499-03	2026-05-20 09:14:52.893519-03	Esencia de vainilla
37	Frutilla	f	\N	2026-05-20 09:14:52.920925-03	2026-05-20 09:14:52.920946-03	Frutilla fresca
38	Crema chantillí	t	\N	2026-05-20 09:14:52.951638-03	2026-05-20 09:14:52.951665-03	Crema batida con azúcar
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, pedido_id, monto, mp_payment_id, mp_status, external_reference, idempotency_key, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (id, usuario_id, estado_codigo, direccion_id, forma_pago_codigo, total, costo_envio, direccion_snapshot, notas, eliminado_en, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, nombre, descripcion, imagen_url, precio_base, stock_cantidad, disponible, eliminado_en, creado_en, actualizado_en) FROM stdin;
2	Agua mineral con gas	Agua mineral con gas 500ml	\N	850.00	50	t	\N	2026-05-20 09:19:02.716548-03	2026-05-20 09:19:02.716587-03
3	Coca-Cola 500ml	Gaseosa sabor cola 500ml	\N	1200.00	50	t	\N	2026-05-20 09:19:02.775263-03	2026-05-20 09:19:02.775302-03
4	Sprite 500ml	Gaseosa sabor lima-limón 500ml	\N	1200.00	50	t	\N	2026-05-20 09:19:02.83555-03	2026-05-20 09:19:02.83559-03
5	Jugo de naranja natural	Jugo de naranja recién exprimido 400ml	\N	1500.00	50	t	\N	2026-05-20 09:19:02.907656-03	2026-05-20 09:19:02.907679-03
6	Jugo de limón natural	Jugo de limón natural endulzado 400ml	\N	1400.00	50	t	\N	2026-05-20 09:19:02.966877-03	2026-05-20 09:19:02.966914-03
7	Milanesa napolitana	Milanesa de carne con salsa de tomate, muzzarella y orégano	\N	5500.00	50	t	\N	2026-05-20 09:19:03.031507-03	2026-05-20 09:19:03.031542-03
8	Bife de chorizo	Bife de chorizo 300g con guarnición	\N	6800.00	50	t	\N	2026-05-20 09:19:03.096706-03	2026-05-20 09:19:03.096742-03
9	Pollo a la parrilla	Pechuga de pollo a la parrilla con ensalada	\N	5200.00	50	t	\N	2026-05-20 09:19:03.173032-03	2026-05-20 09:19:03.173066-03
10	Tallarines con bolognesa	Tallarines con salsa bolognesa casera	\N	4800.00	50	t	\N	2026-05-20 09:19:03.232158-03	2026-05-20 09:19:03.232198-03
11	Ravioles de ricota	Ravioles artesanales de ricota con salsa	\N	5200.00	50	t	\N	2026-05-20 09:19:03.300939-03	2026-05-20 09:19:03.300976-03
12	Lasaña clásica	Lasaña de carne con ricota y muzzarella	\N	6200.00	50	t	\N	2026-05-20 09:19:03.392467-03	2026-05-20 09:19:03.392499-03
13	Ensalada César	Ensalada con pollo, queso parmesano y huevo	\N	4500.00	50	t	\N	2026-05-20 09:19:03.467005-03	2026-05-20 09:19:03.467105-03
14	Ensalada mixta	Lechuga, tomate, cebolla, zanahoria y aceitunas	\N	3200.00	50	t	\N	2026-05-20 09:19:03.534052-03	2026-05-20 09:19:03.534092-03
15	Bowl de palta	Bowl con palta, pepino, tomate y aceitunas	\N	4200.00	50	t	\N	2026-05-20 09:19:03.594165-03	2026-05-20 09:19:03.594194-03
16	Papas fritas	Porción de papas fritas crujientes	\N	2800.00	50	t	\N	2026-05-20 09:19:03.659362-03	2026-05-20 09:19:03.659392-03
17	Maní salado	Porción de maní tostado y salado	\N	1500.00	50	t	\N	2026-05-20 09:19:03.725516-03	2026-05-20 09:19:03.725546-03
18	Flan casero	Flan casero con dulce de leche y crema	\N	3500.00	50	t	\N	2026-05-20 09:19:03.787689-03	2026-05-20 09:19:03.787713-03
19	Brownie de chocolate	Brownie húmedo de chocolate con nueces	\N	3200.00	50	t	\N	2026-05-20 09:19:03.84292-03	2026-05-20 09:19:03.842946-03
20	Helado de frutilla	Helado artesanal de frutilla 2 bochas	\N	2800.00	50	t	\N	2026-05-20 09:19:03.916395-03	2026-05-20 09:19:03.916422-03
1	Agua mineral sin gas	Agua mineral natural 500ml	\N	800.00	50	t	\N	2026-05-20 09:19:02.643281-03	2026-05-20 09:20:10.443971-03
\.


--
-- Data for Name: productos_categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos_categorias (producto_id, categoria_id, es_principal) FROM stdin;
2	6	f
3	5	f
4	5	f
5	7	f
6	7	f
7	10	f
8	10	f
9	10	f
10	9	f
11	9	f
12	9	f
13	11	f
14	11	f
15	11	f
16	12	f
17	12	f
18	13	f
19	13	f
20	13	f
1	6	f
\.


--
-- Data for Name: productos_ingredientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos_ingredientes (producto_id, ingrediente_id, es_removible) FROM stdin;
7	1	f
7	5	t
7	10	t
7	23	t
8	1	f
8	20	t
8	21	t
9	2	f
9	20	t
9	22	t
10	27	f
10	29	t
10	11	t
10	1	t
10	12	t
11	28	f
11	30	f
11	29	t
11	5	t
12	28	f
12	1	f
12	10	t
12	30	t
12	5	t
13	13	f
13	2	f
13	5	t
13	9	t
14	13	f
14	10	t
14	11	t
14	14	t
14	18	t
15	17	f
15	13	f
15	10	t
15	15	t
15	18	t
16	19	f
16	20	t
16	22	t
17	32	f
17	20	t
18	8	f
18	9	f
18	36	t
18	38	t
18	35	t
19	34	f
19	9	f
19	26	f
19	7	t
20	37	f
20	8	f
20	6	t
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token_hash, usuario_id, expires_at, revoked_at, creado_en) FROM stdin;
1	dc9670c16b265e99803624d4885e2c6f233c90475aa9b1ddd0639ff0a6eab377	2	2026-05-26 19:00:30.943793-03	\N	2026-05-19 19:00:30.944065-03
2	498a62562282ce69876e89602163aa0f212ee8d90226412feb8573ce4573e1b8	2	2026-05-26 19:50:41.270917-03	\N	2026-05-19 19:50:41.271126-03
3	db8cef7f5a67227b45c8be1d4e5995b1074e11c5ee42a900c2c65c577c922565	2	2026-05-26 20:21:24.027004-03	\N	2026-05-19 20:21:24.027584-03
4	011f9b37685315bf3c43aba924873ca0f61952d588e1697dd377f43bca4027e3	3	2026-05-26 21:49:09.928778-03	\N	2026-05-19 21:49:09.929031-03
5	ff6f90693571cfc5cf804334935c3cb0ec56c1efe2bd2caa5ce199bac7a821ed	3	2026-05-26 22:31:37.035185-03	2026-05-19 23:03:49.894677-03	2026-05-19 22:31:37.035427-03
6	12c031c4fb1e56a76be305a9e10b2aac341021f349ea9008a94d1b80d09ceef8	3	2026-05-26 23:03:49.90214-03	\N	2026-05-19 23:03:49.902323-03
7	004ba61778ba3359bf2c5622f782f5b3ad02499eb171e54d6ccf6f96ef2960a2	3	2026-05-27 08:31:18.856842-03	\N	2026-05-20 08:31:18.85708-03
8	78c390b0ad620f0ca36571b31a9dfaa649d15a2c9fec8fc19c60b2a7f2edcf0c	2	2026-05-27 08:52:36.646124-03	\N	2026-05-20 08:52:36.646366-03
10	1e97d7273fd73cf00c6ad58a742106b55ccbd82cdf15909f01b82c4ba09248a1	3	2026-05-27 09:12:02.036415-03	\N	2026-05-20 09:12:02.036664-03
11	a54ff92abce20cdb44f38683564ac6dd69576fc8bceef5b7f1545046d94f9292	3	2026-05-27 09:19:02.596906-03	\N	2026-05-20 09:19:02.597235-03
12	450eac1d1c6a3db878ddf7a6aa4743ea27707745526e07fa262e35c5392730d8	2	2026-05-27 09:29:19.481162-03	\N	2026-05-20 09:29:19.481356-03
9	8eead804689c85f3b7a1145d1eade87cd29d968b4a36f94ace8e76279b5c434e	3	2026-05-27 08:55:19.952522-03	2026-05-20 09:30:20.979746-03	2026-05-20 08:55:19.952717-03
14	5079e388f5435687352070c70e960d17bd0edd28a81b91f1490832405342e8e0	2	2026-05-27 11:23:31.851052-03	\N	2026-05-20 11:23:31.852532-03
13	c82ae57a7261b9a63c68c9d3a0fbbd06e4c905430ee9893d82c53ddf5958b659	3	2026-05-27 09:30:20.986865-03	2026-05-20 15:07:39.128784-03	2026-05-20 09:30:20.987238-03
15	2d390745ca14e0f190f169cc45c605124df80af69644c74918c8430f4d7b9c14	2	2026-05-27 11:34:47.977454-03	2026-05-20 15:27:55.834476-03	2026-05-20 11:34:47.977684-03
17	3f796f7682a507e886643292be7fb7da1fabcc275f6f558007a0c5ddfdc9388a	2	2026-05-27 15:27:55.841373-03	\N	2026-05-20 15:27:55.841633-03
16	9fda000cfbc9788a775aa91a34575977d6d65da67b6c9e7044ba3148bb059d45	3	2026-05-27 15:07:39.134857-03	2026-05-20 15:38:18.380428-03	2026-05-20 15:07:39.135036-03
18	201d4277dae36844985f927422fca3d428be7a1aa983e497ccdf1a6f021a3c5a	3	2026-05-27 15:38:18.385459-03	\N	2026-05-20 15:38:18.385849-03
19	64cae9bc3a0861362f31d6ddc15a5d0ae437eedd725f702969bbc8f0d20bedf5	2	2026-05-27 15:38:44.835722-03	\N	2026-05-20 15:38:44.835898-03
20	f5fc348949c8c9a93b5df3b7fa07f3c682594e22f15b82db067e669b3a52a7a9	2	2026-05-27 15:42:26.36122-03	2026-05-20 17:09:27.291805-03	2026-05-20 15:42:26.361363-03
21	b9432995140e7e7fef770c58220586ad9ee469ad1f3287a0382bf14f54d5339e	2	2026-05-27 17:09:27.29595-03	\N	2026-05-20 17:09:27.296222-03
22	415ecd810046d0d06114134d952e85050f19a32218b9bcbcb44d952b4c32e5e3	4	2026-05-28 08:40:43.894056-03	\N	2026-05-21 08:40:43.89429-03
23	33081712eb8a8363b7fe51aa00fc631a3154be829a76bb7b7867cbff9555b374	3	2026-05-28 08:44:36.050249-03	\N	2026-05-21 08:44:36.050415-03
24	c557938d5df147a2448761aa861d582b60e2205938dee9b5e23e37e9b3b7afa9	2	2026-05-28 08:47:30.598201-03	\N	2026-05-21 08:47:30.598408-03
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (codigo, descripcion) FROM stdin;
ADMIN	Acceso total al sistema
CLIENT	Usuario que realiza pedidos
STOCK	Gestión de productos e inventario
PEDIDOS	Gestión y seguimiento de pedidos
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, apellido, email, password_hash, telefono, eliminado_en, creado_en, actualizado_en) FROM stdin;
2	Brian	Palacios	brianpalacios@gmail.com	$2b$12$0/7DFNUGvd7R/d5Ey1m.p.3Is7YQZO2tRdCatnwvG69EHYFKiPXei	\N	\N	2026-05-19 19:00:16.40076-03	2026-05-19 19:00:16.400782-03
3	Admin	FoodStore	admin@foodstore.com	$2b$12$4xz.3oa.HIq2ntZbhornY.FMyDw2BZAGngDGLwXplnhNRevK4V7Uu	\N	\N	2026-05-19 21:42:39.228864-03	2026-05-19 21:42:39.228884-03
4	Sergio	Haquin	sergiohaquin@gmail.com	$2b$12$rJo98WKnhuP8vUJG.A1qQO2GWI4yPQTco9/M6kJe8lpuaPDWihkTG	\N	\N	2026-05-21 08:40:37.00228-03	2026-05-21 08:40:37.002302-03
\.


--
-- Data for Name: usuarios_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios_roles (usuario_id, rol_codigo, asignado_por_id, creado_en) FROM stdin;
2	CLIENT	\N	2026-05-19 19:00:16.404457-03
3	ADMIN	\N	2026-05-19 21:42:39.233976-03
4	CLIENT	\N	2026-05-21 08:40:37.008961-03
\.


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 13, true);


--
-- Name: detalles_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_pedido_id_seq', 1, false);


--
-- Name: direcciones_entrega_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.direcciones_entrega_id_seq', 2, true);


--
-- Name: historial_estados_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_estados_pedido_id_seq', 1, false);


--
-- Name: ingredientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredientes_id_seq', 38, true);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 1, false);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 20, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 24, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (clave);


--
-- Name: detalles_pedido detalles_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_pkey PRIMARY KEY (id);


--
-- Name: direcciones_entrega direcciones_entrega_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direcciones_entrega
    ADD CONSTRAINT direcciones_entrega_pkey PRIMARY KEY (id);


--
-- Name: estados_pedido estados_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_pedido
    ADD CONSTRAINT estados_pedido_pkey PRIMARY KEY (codigo);


--
-- Name: formas_pago formas_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formas_pago
    ADD CONSTRAINT formas_pago_pkey PRIMARY KEY (codigo);


--
-- Name: historial_estados_pedido historial_estados_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_pedido
    ADD CONSTRAINT historial_estados_pedido_pkey PRIMARY KEY (id);


--
-- Name: ingredientes ingredientes_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredientes
    ADD CONSTRAINT ingredientes_nombre_key UNIQUE (nombre);


--
-- Name: ingredientes ingredientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredientes
    ADD CONSTRAINT ingredientes_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_external_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_external_reference_key UNIQUE (external_reference);


--
-- Name: pagos pagos_idempotency_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: pagos pagos_mp_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_mp_payment_id_key UNIQUE (mp_payment_id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: productos_categorias productos_categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_categorias
    ADD CONSTRAINT productos_categorias_pkey PRIMARY KEY (producto_id, categoria_id);


--
-- Name: productos_ingredientes productos_ingredientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_ingredientes
    ADD CONSTRAINT productos_ingredientes_pkey PRIMARY KEY (producto_id, ingrediente_id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (codigo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios_roles usuarios_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_roles
    ADD CONSTRAINT usuarios_roles_pkey PRIMARY KEY (usuario_id, rol_codigo);


--
-- Name: ix_refresh_tokens_token_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_refresh_tokens_token_hash ON public.refresh_tokens USING btree (token_hash);


--
-- Name: ix_usuarios_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_usuarios_email ON public.usuarios USING btree (email);


--
-- Name: categorias categorias_padre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_padre_id_fkey FOREIGN KEY (padre_id) REFERENCES public.categorias(id);


--
-- Name: detalles_pedido detalles_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: detalles_pedido detalles_pedido_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: direcciones_entrega direcciones_entrega_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direcciones_entrega
    ADD CONSTRAINT direcciones_entrega_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: historial_estados_pedido historial_estados_pedido_estado_desde_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_pedido
    ADD CONSTRAINT historial_estados_pedido_estado_desde_fkey FOREIGN KEY (estado_desde) REFERENCES public.estados_pedido(codigo);


--
-- Name: historial_estados_pedido historial_estados_pedido_estado_hasta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_pedido
    ADD CONSTRAINT historial_estados_pedido_estado_hasta_fkey FOREIGN KEY (estado_hasta) REFERENCES public.estados_pedido(codigo);


--
-- Name: historial_estados_pedido historial_estados_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_pedido
    ADD CONSTRAINT historial_estados_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: historial_estados_pedido historial_estados_pedido_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_pedido
    ADD CONSTRAINT historial_estados_pedido_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: pagos pagos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: pedidos pedidos_direccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_direccion_id_fkey FOREIGN KEY (direccion_id) REFERENCES public.direcciones_entrega(id);


--
-- Name: pedidos pedidos_estado_codigo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_estado_codigo_fkey FOREIGN KEY (estado_codigo) REFERENCES public.estados_pedido(codigo);


--
-- Name: pedidos pedidos_forma_pago_codigo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_forma_pago_codigo_fkey FOREIGN KEY (forma_pago_codigo) REFERENCES public.formas_pago(codigo);


--
-- Name: pedidos pedidos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: productos_categorias productos_categorias_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_categorias
    ADD CONSTRAINT productos_categorias_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- Name: productos_categorias productos_categorias_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_categorias
    ADD CONSTRAINT productos_categorias_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: productos_ingredientes productos_ingredientes_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_ingredientes
    ADD CONSTRAINT productos_ingredientes_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingredientes(id);


--
-- Name: productos_ingredientes productos_ingredientes_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_ingredientes
    ADD CONSTRAINT productos_ingredientes_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: refresh_tokens refresh_tokens_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: usuarios_roles usuarios_roles_asignado_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_roles
    ADD CONSTRAINT usuarios_roles_asignado_por_id_fkey FOREIGN KEY (asignado_por_id) REFERENCES public.usuarios(id);


--
-- Name: usuarios_roles usuarios_roles_rol_codigo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_roles
    ADD CONSTRAINT usuarios_roles_rol_codigo_fkey FOREIGN KEY (rol_codigo) REFERENCES public.roles(codigo);


--
-- Name: usuarios_roles usuarios_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_roles
    ADD CONSTRAINT usuarios_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 9IHAe9Bb5QMLUm5OgU4AZiA3jWhXgBn2Vk2g5pWlmmXVK6FgqYvZxP4YdLLbkmF

