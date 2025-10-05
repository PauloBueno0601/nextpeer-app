-- Reverter CPF para obrigatório
ALTER TABLE usuarios ALTER COLUMN cpf SET NOT NULL;
