-- Exemplo de funções SQL no Supabase

-- Criar as tabelas necessárias
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  idade INTEGER,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  saldo NUMERIC DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função simples que retorna uma mensagem
CREATE OR REPLACE FUNCTION hello_world()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'Olá mundo!';
END;
$$;

-- Função que aceita parâmetros
CREATE OR REPLACE FUNCTION soma_numeros(a integer, b integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN a + b;
END;
$$;

-- Função que consulta dados de uma tabela
CREATE OR REPLACE FUNCTION buscar_usuarios(limite integer DEFAULT 10)
RETURNS SETOF usuarios
LANGUAGE sql
AS $$
  SELECT * FROM usuarios ORDER BY criado_em DESC LIMIT limite;
$$;

-- Função para inserir um novo usuário e retornar o registro inserido
CREATE OR REPLACE FUNCTION adicionar_usuario(
  p_nome text,
  p_email text,
  p_idade integer
)
RETURNS usuarios
LANGUAGE plpgsql
AS $$
DECLARE
  novo_usuario usuarios;
BEGIN
  INSERT INTO usuarios (nome, email, idade)
  VALUES (p_nome, p_email, p_idade)
  RETURNING * INTO novo_usuario;
  
  RETURN novo_usuario;
END;
$$;

-- Função que usa lógica condicional
CREATE OR REPLACE FUNCTION obter_faixa_etaria(idade integer)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  IF idade < 18 THEN
    RETURN 'Jovem';
  ELSIF idade < 60 THEN
    RETURN 'Adulto';
  ELSE
    RETURN 'Idoso';
  END IF;
END;
$$;

-- Exemplo de trigger function
CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$;

-- Criar o trigger usando a função acima
CREATE TRIGGER trigger_atualizar_data_modificacao
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_modificacao();

-- Função que retorna uma tabela customizada
CREATE OR REPLACE FUNCTION estatisticas_usuarios()
RETURNS TABLE (
  total_usuarios bigint,
  idade_media numeric,
  usuarios_jovens bigint,
  usuarios_adultos bigint,
  usuarios_idosos bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_usuarios,
    AVG(idade) as idade_media,
    COUNT(*) FILTER (WHERE idade < 18) as usuarios_jovens,
    COUNT(*) FILTER (WHERE idade >= 18 AND idade < 60) as usuarios_adultos,
    COUNT(*) FILTER (WHERE idade >= 60) as usuarios_idosos
  FROM usuarios;
END;
$$;

-- Função com tratamento de erros
CREATE OR REPLACE FUNCTION transferir_saldo(
  origem_id integer,
  destino_id integer,
  valor numeric
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se o valor é positivo
  IF valor <= 0 THEN
    RAISE EXCEPTION 'Valor da transferência deve ser positivo';
  END IF;
  
  -- Atualizar saldo da conta de origem
  UPDATE contas
  SET saldo = saldo - valor
  WHERE id = origem_id AND saldo >= valor;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conta de origem não encontrada ou saldo insuficiente';
  END IF;
  
  -- Atualizar saldo da conta de destino
  UPDATE contas
  SET saldo = saldo + valor
  WHERE id = destino_id;
  
  IF NOT FOUND THEN
    -- Reverter a transação na conta de origem
    UPDATE contas
    SET saldo = saldo + valor
    WHERE id = origem_id;
    
    RAISE EXCEPTION 'Conta de destino não encontrada';
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erro ao transferir saldo: %', SQLERRM;
    RETURN FALSE;
END;
$$; 