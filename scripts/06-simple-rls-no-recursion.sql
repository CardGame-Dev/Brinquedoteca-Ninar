-- Script ULTRA SIMPLES para evitar recursão RLS
-- Este script resolve definitivamente o problema de recursão infinita

-- 1. Renomear coluna se necessário
ALTER TABLE public.users RENAME COLUMN citie TO city_id;

-- 2. Remover TODAS as políticas RLS existentes
DROP POLICY IF EXISTS "Pode ver usuários da mesma cidade" ON public.users;
DROP POLICY IF EXISTS "adminUnidade pode atualizar usuários da sua cidade" ON public.users;
DROP POLICY IF EXISTS "adminUnidade pode excluir usuários da sua cidade" ON public.users;
DROP POLICY IF EXISTS "adminUnidade pode inserir usuários na sua cidade" ON public.users;
DROP POLICY IF EXISTS "adminMaster pode selecionar" ON public.users;
DROP POLICY IF EXISTS "adminMaster pode atualizar" ON public.users;
DROP POLICY IF EXISTS "adminMaster pode excluir" ON public.users;
DROP POLICY IF EXISTS "adminMaster pode inserir" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can manage users" ON public.users;
DROP POLICY IF EXISTS "Ver usuários da mesma cidade" ON public.users;
DROP POLICY IF EXISTS "Inserir usuários" ON public.users;
DROP POLICY IF EXISTS "Atualizar usuários" ON public.users;
DROP POLICY IF EXISTS "Excluir usuários" ON public.users;

-- 3. Remover funções que podem causar recursão
DROP FUNCTION IF EXISTS auth_city_id();
DROP FUNCTION IF EXISTS get_current_user_city_id();

-- 4. Desabilitar RLS temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 5. Reabilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. Criar UMA ÚNICA política muito simples
-- Permite tudo para usuários autenticados - controle de permissões no app
CREATE POLICY "Usuários autenticados podem gerenciar usuários"
ON public.users 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Garantir que as tabelas auxiliares existem
CREATE TABLE IF NOT EXISTS public.cities (
  id_city UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_city TEXT NOT NULL,
  uf TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id_city),
  uf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Políticas simples para tabelas auxiliares
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;
DROP POLICY IF EXISTS "Authenticated users can manage cities" ON public.cities;
DROP POLICY IF EXISTS "Anyone can view cargos" ON public.cargos;
DROP POLICY IF EXISTS "Authenticated users can manage cargos" ON public.cargos;

-- Criar políticas simples
CREATE POLICY "Qualquer um pode ver cidades" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem gerenciar cidades" ON public.cities FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Qualquer um pode ver cargos" ON public.cargos FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem gerenciar cargos" ON public.cargos FOR ALL TO authenticated USING (true) WITH CHECK (true);
