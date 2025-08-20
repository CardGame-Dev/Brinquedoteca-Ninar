-- Dados iniciais para o sistema

-- Inserir categorias padrão
INSERT INTO categories (name, description) VALUES
('Jogos de Tabuleiro', 'Jogos que são jogados em um tabuleiro'),
('Brinquedos Educativos', 'Brinquedos que auxiliam no aprendizado'),
('Bonecas e Bonecos', 'Figuras humanoides para brincadeiras'),
('Carrinhos e Veículos', 'Brinquedos de transporte e veículos'),
('Jogos de Construção', 'Blocos e peças para construir'),
('Instrumentos Musicais', 'Brinquedos que produzem sons musicais'),
('Esportes e Atividades', 'Brinquedos para atividades físicas')
ON CONFLICT (name) DO NOTHING;

-- Inserir usuário admin padrão
INSERT INTO users (email, name, role) VALUES
('admin@brinquedoteca.com', 'Administrador', 'admin'),
('usuario@brinquedoteca.com', 'Usuário Teste', 'user')
ON CONFLICT (email) DO NOTHING;

-- Inserir alguns brinquedos de exemplo
INSERT INTO items (name, description, category_id, status) VALUES
('Quebra-cabeça 1000 peças', 'Quebra-cabeça com paisagem natural', 
 (SELECT id FROM categories WHERE name = 'Jogos de Tabuleiro'), 'available'),
('Lego Classic', 'Conjunto de blocos de construção coloridos', 
 (SELECT id FROM categories WHERE name = 'Jogos de Construção'), 'available'),
('Boneca Barbie', 'Boneca com roupas e acessórios', 
 (SELECT id FROM categories WHERE name = 'Bonecas e Bonecos'), 'available'),
('Carrinho Hot Wheels', 'Carrinho de corrida em miniatura', 
 (SELECT id FROM categories WHERE name = 'Carrinhos e Veículos'), 'available'),
('Xilofone Infantil', 'Instrumento musical colorido', 
 (SELECT id FROM categories WHERE name = 'Instrumentos Musicais'), 'available');
