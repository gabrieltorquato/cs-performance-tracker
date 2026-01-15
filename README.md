# CS Performance Tracker 🎯

Pipeline completo para análise automática de performance no CS2 a partir de demos.

## 🔍 O que o projeto faz
- Upload de demos (.dem)
- Parsing automático via parser em Go
- Extração de estatísticas reais (kills, deaths, assists, ADR)
- Split por lado (CT / TR)
- Rating geral e por lado
- Persistência com Prisma + SQLite

## 🧱 Arquitetura
- **Node.js + Express** — API e orquestração
- **Go (demoinfocs)** — parsing de demos CS2
- **Prisma ORM** — modelagem e persistência
- **SQLite** — banco local (dev)

