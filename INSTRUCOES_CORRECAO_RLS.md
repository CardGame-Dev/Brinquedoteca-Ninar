# Instruções para Corrigir o Erro de RLS na Tabela Users

## Problema Identificado
O erro "new row violates row-level security policy for table users" ocorre porque:

1. **Estrutura da tabela incompleta**: A tabela `users` não possui os campos `position` e `citie` que o código TypeScript está tentando inserir.

2. **Políticas RLS restritivas**: As políticas atuais só permitem que usuários criem seus próprios perfis, mas não permitem que admins criem usuários.

3. **Inconsistência de roles**: O banco define roles como `('user', 'admin')`, mas o código usa `('adminMaster', 'adminUnidade', 'user')`.

## Solução

### Passo 1: Executar o Script SQL
Execute o script `scripts/04-fix-users-table-and-rls.sql` no painel do Supabase:

1. Acesse o painel do Supabase (https://supabase.com)
2. Vá para o seu projeto
3. Clique em "SQL Editor"
4. Cole o conteúdo do arquivo `scripts/04-fix-users-table-and-rls.sql`
5. Execute o script

### Passo 2: Verificar as Alterações
Após executar o script, verifique se:

1. A tabela `users` agora possui os campos `position` e `citie`
2. As políticas RLS foram atualizadas para permitir que admins criem usuários
3. Os roles foram expandidos para incluir `adminMaster` e `adminUnidade`

### Passo 3: Testar a Funcionalidade
1. Faça login como um usuário com role `adminMaster` ou `adminUnidade`
2. Tente adicionar um novo usuário através da interface
3. Verifique se o erro não ocorre mais

## O que o Script Faz

1. **Adiciona campos faltantes**:
   - `position TEXT` - para o cargo do usuário
   - `citie UUID` - referência para a cidade do usuário

2. **Atualiza constraints de role**:
   - Adiciona suporte para `adminMaster` e `adminUnidade`

3. **Corrige políticas RLS**:
   - Permite que admins visualizem todos os usuários
   - Permite que admins criem novos usuários
   - Permite que admins atualizem qualquer usuário
   - Permite que admins excluam usuários

4. **Cria tabelas auxiliares**:
   - `cities` - para gerenciar cidades
   - `cargos` - para gerenciar cargos

5. **Configura políticas RLS para tabelas auxiliares**:
   - Leitura pública para cidades e cargos
   - Escrita apenas para admins

## Verificação Pós-Execução

Após executar o script, você pode verificar se tudo está funcionando:

```sql
-- Verificar estrutura da tabela users
\d users;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Testar inserção (substitua pelos valores corretos)
INSERT INTO users (name, email, role, position, citie) 
VALUES ('Teste', 'teste@teste.com', 'user', 'Cargo Teste', 'uuid-da-cidade');
```

## Notas Importantes

- Certifique-se de ter um usuário com role `adminMaster` ou `adminUnidade` para testar
- Se você não tiver cidades cadastradas, crie algumas na tabela `cities` antes de testar
- O script é idempotente, ou seja, pode ser executado múltiplas vezes sem problemas
