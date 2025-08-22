--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: StoicPhraseTable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StoicPhrase" (
    id integer NOT NULL,
    content text NOT NULL,
    author text DEFAULT ''::text NOT NULL,
    ru_translation text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."StoicPhrase" OWNER TO postgres;

--
-- Name: StoicPhrase_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."StoicPhrase_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."StoicPhrase_id_seq" OWNER TO postgres;

--
-- Name: StoicPhrase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."StoicPhrase_id_seq" OWNED BY public."StoicPhrase".id;


--
-- Name: UserSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSetting" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    schedule text NOT NULL,
    send_quote boolean DEFAULT false NOT NULL
);


ALTER TABLE public."UserSetting" OWNER TO postgres;

--
-- Name: UserSetting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserSetting_id_seq" OWNER TO postgres;

--
-- Name: UserSetting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserSetting_id_seq" OWNED BY public."UserSetting".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: StoicPhraseTable id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StoicPhrase" ALTER COLUMN id SET DEFAULT nextval('public."StoicPhrase_id_seq"'::regclass);


--
-- Name: UserSetting id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting" ALTER COLUMN id SET DEFAULT nextval('public."UserSetting_id_seq"'::regclass);


--
-- Data for Name: StoicPhraseTable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StoicPhrase" (id, content, author, ru_translation) FROM stdin;
3	The more we value things outside our control, the less control we have.	Epictetus	Чем больше мы ценим вещи, находящиеся вне нашего контроля, тем меньше у нас контроля. — Эпиктет
4	We suffer more often in imagination than in reality.	Seneca	Мы страдаем чаще в воображении, чем в реальности. — Сенека
5	It is not death that a man should fear, but he should fear never beginning to live.	Marcus Aurelius	«Не смерть следует бояться, но следует бояться никогда не начать жить. — Марк Аврелий»
6	Wealth consists not in having great possessions, but in having few wants.	Epictetus	Богатство состоит не в обладании большими богатствами, а в обладании немногими желаниями. — Эпиктет
7	If you are distressed by anything external, the pain is not due to the thing itself but to your estimate of it.	Marcus Aurelius	Если что-то внешнее вызывает у вас беспокойство, то боль не из-за этого, а из-за вашей оценки этого. — Марк Аврелий
8	It is the power of the mind to be unconquerable.	Seneca	Сила разума — быть непобежденным. — Сенека
1	The happiness of your life depends upon the quality of your thoughts.	Marcus Aurelius	Счастье вашей жизни зависит от качества ваших мыслей. — Марк Аврелий
2	You have power over your mind — not outside events. Realize this, and you will find strength	Marcus Aurelius	«Вы обладаете властью над своим разумом — а не над внешними событиями. Осознайте это, и вы найдете силу». — Марк Аврелий
9	First say to yourself what you would be; and then do what you have to do.	Epictetus	Сначала скажите себе, кем вы хотите быть, а затем сделайте то, что необходимо. — Эпиктет
10	No man is free, who is not master of himself.	Epictetus	«Никто не свободен, кто не владеет собой. — Эпиктет»
11	Begin at once to live, and count each separate day as a separate life.	Seneca	«Начни жить прямо сейчас, и считай каждый день отдельной жизнью. — Сенека»
12	Be tolerant with others and strict with yourself.	Marcus Aurelius	Будьте терпимы с другими и строги с собой. — Марк Аврелий
13	Don’t explain your philosophy. Embody it.	Epictetus	Не объясняйте свою философию. Воплощайте её. — Эпиктет
14	You could leave life right now. Let that determine what you do and say and think.	Marcus Aurelius	Вы могли бы покинуть эту жизнь прямо сейчас. Пусть это определит, что вы делаете, говорите и думаете. — Марк Аврелий
15	He who angers you conquers you.	Elizabeth Kenny	Тот, кто злится на вас, побеждает вас. — Элизабета Кенни
16	It’s not what happens to you, but how you react to it that matters.	Epictetus	«Не то, что с вами происходит, а то, как вы на это реагируете, имеет значение. — Эпиктет»
17	The obstacle in the path becomes the path. Never forget, within every obstacle is an opportunity to improve our condition.	Ryan Holiday	«Препятствие на пути становится путем. Никогда не забывайте, что в каждом препятствии скрыта возможность улучшить наше положение. — Райан Холидей»
18	Happiness and freedom begin with a clear understanding of one principle: Some things are within our control, and some things are not.	Epictetus	«Счастье и свобода начинаются с ясного понимания одного принципа: некоторые вещи находятся в нашей власти, а некоторые нет. — Эпиктет»
19	Man conquers the world by conquering himself.	Zeno of Citium	Человек побеждает мир, побеждая самого себя. — Зенон из Кития
20	Self-control is strength. Right thought is mastery. Calmness is power.	James Allen	Самоконтроль — это сила. Правильная мысль — это мастерство. Спокойствие — это сила. — Джеймс Аллен
21	You cannot control the world, but you can control your reactions to it.	Unknown	«Вы не можете контролировать мир, но вы можете контролировать свою реакцию на него. — Неизвестный»
\.


--
-- Data for Name: UserSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSetting" (id, "userId", schedule, send_quote) FROM stdin;
1	56464958	17:15	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2bd60150-005d-4270-b711-82a1cfc40e39	2b76ec7c51c11ce7d5c7bb8552f30fc653c883da25c57ed07adca4dfe95009e7	2025-04-29 15:14:31.538096+02	20250428161631_init	\N	\N	2025-04-29 15:14:31.53104+02	1
8165a1ab-4525-44e0-b9b2-ff8804524cad	ecadd948388326ee6ea22ce055f376f38725a0904e5890137559e12ad3ad25ad	2025-04-29 15:14:31.540237+02	20250428184909_add_ru_translate_to_stoic_phrase	\N	\N	2025-04-29 15:14:31.538673+02	1
7013a9fc-bc7d-4a49-a889-c7d09a51815a	e446e8746db7501cdd1c7e97fa1bd3fe8c4b51f4932b92e5825aec2b3416929d	2025-04-29 15:14:31.542235+02	20250429062221_add_author	\N	\N	2025-04-29 15:14:31.540668+02	1
\.


--
-- Name: StoicPhrase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StoicPhrase_id_seq"', 1, false);


--
-- Name: UserSetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserSetting_id_seq"', 1, true);


--
-- Name: StoicPhraseTable StoicPhrase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StoicPhrase"
    ADD CONSTRAINT "StoicPhrase_pkey" PRIMARY KEY (id);


--
-- Name: UserSetting UserSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSetting"
    ADD CONSTRAINT "UserSetting_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: UserSetting_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserSetting_userId_key" ON public."UserSetting" USING btree ("userId");


--
-- PostgreSQL database dump complete
--

