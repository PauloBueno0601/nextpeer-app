-- Tornar o campo CPF nullable
ALTER TABLE usuarios ALTER COLUMN cpf DROP NOT NULL;
