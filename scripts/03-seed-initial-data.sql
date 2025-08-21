-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
  ('Educativos', 'Brinquedos que estimulam o aprendizado'),
  ('Esportivos', 'Brinquedos para atividades físicas'),
  ('Criativos', 'Brinquedos para desenvolver criatividade'),
  ('Eletrônicos', 'Brinquedos com componentes eletrônicos'),
  ('Jogos', 'Jogos de tabuleiro e cartas')
ON CONFLICT (name) DO NOTHING;

-- Insert sample items
INSERT INTO public.items (name, description, category_id, status) VALUES
  ('Quebra-cabeça 1000 peças', 'Quebra-cabeça com paisagem natural', 
   (SELECT id FROM public.categories WHERE name = 'Educativos'), 'disponivel'),
  ('Bola de Futebol', 'Bola oficial para futebol de campo', 
   (SELECT id FROM public.categories WHERE name = 'Esportivos'), 'disponivel'),
  ('Kit de Pintura', 'Kit completo com tintas e pincéis', 
   (SELECT id FROM public.categories WHERE name = 'Criativos'), 'disponivel'),
  ('Tablet Educativo', 'Tablet com jogos educativos para crianças', 
   (SELECT id FROM public.categories WHERE name = 'Eletrônicos'), 'disponivel'),
  ('Jogo de Xadrez', 'Tabuleiro de xadrez com peças de madeira', 
   (SELECT id FROM public.categories WHERE name = 'Jogos'), 'disponivel')
ON CONFLICT DO NOTHING;
