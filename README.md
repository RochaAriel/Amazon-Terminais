# Amazon Terminais Site

Site institucional moderno em React + Vite + Tailwind CSS.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

A saída final será criada na pasta `dist/`.

## Deploy GitHub Pages + GoDaddy

1. Suba este projeto para um repositório GitHub.
2. Em `Settings > Pages`, selecione `GitHub Actions` como source.
3. Faça push na branch `main`.
4. Em `Settings > Pages > Custom domain`, configure o domínio.
5. Na GoDaddy, configure os DNS:

### Domínio raiz

```txt
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```

### Subdomínio www

```txt
CNAME www seu-usuario.github.io
```

Depois marque `Enforce HTTPS` no GitHub Pages quando estiver disponível.
