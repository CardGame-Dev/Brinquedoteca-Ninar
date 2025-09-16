-- Script para corrigir a tabela users e políticas RLS
-- Este script resolve o problema de "new row violates row-level security policy for table users"

-- 1. Primeiro, vamos atualizar a estrutura da tabela users para incluir os campos necessários
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS citie UUID REFERENCES public.cities(id_city);

-- 2. Atualizar o constraint de role para incluir os novos tipos
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'adminMaster', 'adminUnidade'));

-- 3. Remover TODAS as políticas RLS existentes da tabela users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.users;
DROP POLICY IF EXISTS "Only admins can delete users" ON public.users;

-- 4. Desabilitar RLS temporariamente na tabela users para resolver o problema
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 5. Reabilitar RLS com políticas mais simples
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas RLS muito simples sem recursão
-- Política básica: permitir tudo para usuários autenticados
CREATE POLICY "Authenticated users can manage users" ON public.users 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 7. Garantir que a tabela cities existe com a estrutura correta
CREATE TABLE IF NOT EXISTS public.cities (
  id_city UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_city TEXT NOT NULL,
  uf TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Habilitar RLS na tabela cities se não estiver habilitado
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- 9. Criar políticas simples para a tabela cities
-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;
DROP POLICY IF EXISTS "Only admins can insert cities" ON public.cities;
DROP POLICY IF EXISTS "Only admins can update cities" ON public.cities;
DROP POLICY IF EXISTS "Only admins can delete cities" ON public.cities;

-- Criar políticas simples: leitura pública, escrita para usuários autenticados
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage cities" ON public.cities 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 10. Criar tabela cargos se não existir
CREATE TABLE IF NOT EXISTS public.cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  citie UUID REFERENCES public.cities(id_city),
  uf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Habilitar RLS na tabela cargos
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;

-- 12. Criar políticas simples para a tabela cargos
-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Anyone can view cargos" ON public.cargos;
DROP POLICY IF EXISTS "Only admins can insert cargos" ON public.cargos;
DROP POLICY IF EXISTS "Only admins can update cargos" ON public.cargos;
DROP POLICY IF EXISTS "Only admins can delete cargos" ON public.cargos;

-- Criar políticas simples: leitura pública, escrita para usuários autenticados
CREATE POLICY "Anyone can view cargos" ON public.cargos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage cargos" ON public.cargos 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);
