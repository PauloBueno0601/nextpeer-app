-- Adicionar colunas para empresas na tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18) UNIQUE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS razao_social VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nome_fantasia VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tipo_pessoa VARCHAR(20) DEFAULT 'FISICA';

-- Atualizar valores existentes
UPDATE usuarios SET tipo_pessoa = 'FISICA' WHERE tipo_pessoa IS NULL;
