-- Funções avançadas para estatísticas de visualizações de perfis
-- Estas funções complementam o sistema básico de visualizações

-- Criar tabela de logs de visualizações para análises mais detalhadas
CREATE TABLE IF NOT EXISTS profile_view_logs (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT
);

-- Função para registrar visualização com detalhes
CREATE OR REPLACE FUNCTION log_profile_view(
  profile_id INTEGER,
  viewer_ip TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  referrer TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Inserir log de visualização para análises futuras
  INSERT INTO profile_view_logs (profile_id, viewer_ip, user_agent, referrer)
  VALUES (profile_id, viewer_ip, user_agent, referrer);
  
  -- Também incrementa o contador principal
  PERFORM increment_view_count(profile_id);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erro ao registrar visualização detalhada: %', SQLERRM;
END;
$$;

-- Função para obter estatísticas de visualizações de um perfil
CREATE OR REPLACE FUNCTION get_profile_view_stats(profile_id INTEGER)
RETURNS TABLE (
  total_views INTEGER,
  views_today INTEGER,
  views_this_week INTEGER,
  views_this_month INTEGER,
  unique_viewers INTEGER
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_views,
    COUNT(*) FILTER (WHERE viewed_at >= CURRENT_DATE)::INTEGER as views_today,
    COUNT(*) FILTER (WHERE viewed_at >= CURRENT_DATE - INTERVAL '7 days')::INTEGER as views_this_week,
    COUNT(*) FILTER (WHERE viewed_at >= CURRENT_DATE - INTERVAL '30 days')::INTEGER as views_this_month,
    COUNT(DISTINCT viewer_ip)::INTEGER as unique_viewers
  FROM profile_view_logs
  WHERE profile_id = get_profile_view_stats.profile_id;
END;
$$;

-- Função para obter os períodos de maior visualização
CREATE OR REPLACE FUNCTION get_peak_viewing_hours(profile_id INTEGER)
RETURNS TABLE (
  hour_of_day INTEGER,
  view_count BIGINT
)
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT 
    EXTRACT(HOUR FROM viewed_at)::INTEGER as hour_of_day, 
    COUNT(*) as view_count
  FROM profile_view_logs
  WHERE profile_id = get_peak_viewing_hours.profile_id
  GROUP BY hour_of_day
  ORDER BY view_count DESC;
$$;

-- Conceder permissões de execução
GRANT EXECUTE ON FUNCTION log_profile_view(INTEGER, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_profile_view_stats(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_peak_viewing_hours(INTEGER) TO authenticated; 