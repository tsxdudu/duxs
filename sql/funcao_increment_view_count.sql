-- Função para incrementar visualizações de perfil
-- Usada na aplicação para contar visualizações únicas de perfis

-- Primeiro precisamos garantir que a tabela tem o campo view_count
ALTER TABLE profile_settings ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Função para incrementar contagem de visualizações
CREATE OR REPLACE FUNCTION increment_view_count(profile_id INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Atualiza o contador de visualizações e retorna o novo valor
  UPDATE profile_settings
  SET view_count = view_count + 1
  WHERE id = profile_id
  RETURNING view_count INTO current_count;
  
  -- Se não encontrou o perfil, retorna 0
  IF current_count IS NULL THEN
    RAISE EXCEPTION 'Perfil com ID % não encontrado', profile_id;
  END IF;
  
  RETURN current_count;
END;
$$;

-- Version 2: Com parâmetro para desabilitar incremento e apenas ler a contagem
-- Útil para obter o valor atual sem incrementar
CREATE OR REPLACE FUNCTION get_view_count(profile_id INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT view_count INTO current_count
  FROM profile_settings
  WHERE id = profile_id;
  
  -- Se não encontrou o perfil, retorna 0
  IF current_count IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN current_count;
END;
$$;

-- Concede permissão de execução para usuarios anônimos
GRANT EXECUTE ON FUNCTION increment_view_count(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_view_count(INTEGER) TO anon; 