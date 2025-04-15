-- Definição da tabela de configurações de perfil no Supabase
CREATE TABLE IF NOT EXISTS profile_settings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  music_url TEXT,
  music_file TEXT,
  banner_image_url TEXT,
  theme_color TEXT,
  view_count INTEGER DEFAULT 0,
  
  -- Meta informações
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários das colunas para documentação
COMMENT ON TABLE profile_settings IS 'Configurações de perfil dos usuários';
COMMENT ON COLUMN profile_settings.user_id IS 'Referência para tabela de usuários do Supabase Auth';
COMMENT ON COLUMN profile_settings.username IS 'Nome de usuário único para acessar o perfil público';
COMMENT ON COLUMN profile_settings.music_url IS 'URL da música de fundo do perfil';
COMMENT ON COLUMN profile_settings.music_file IS 'Arquivo de música armazenado no storage';
COMMENT ON COLUMN profile_settings.banner_image_url IS 'URL da imagem de fundo do perfil';
COMMENT ON COLUMN profile_settings.theme_color IS 'Cor principal do tema do perfil';
COMMENT ON COLUMN profile_settings.view_count IS 'Contador de visualizações do perfil';

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS profile_settings_user_id_idx ON profile_settings (user_id);
CREATE INDEX IF NOT EXISTS profile_settings_username_idx ON profile_settings (username);
CREATE INDEX IF NOT EXISTS profile_settings_view_count_idx ON profile_settings (view_count DESC);

-- Trigger para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_profile_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger
DROP TRIGGER IF EXISTS update_profile_settings_timestamp ON profile_settings;
CREATE TRIGGER update_profile_settings_timestamp
BEFORE UPDATE ON profile_settings
FOR EACH ROW
EXECUTE FUNCTION update_profile_settings_timestamp();

-- Politicas de Controle de Acesso (RLS)
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- Política para visualização pública
CREATE POLICY "Perfis podem ser visualizados por todos"
  ON profile_settings FOR SELECT
  USING (true);

-- Política para atualização apenas pelo próprio usuário
CREATE POLICY "Usuários podem atualizar apenas seus próprios perfis"
  ON profile_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para inserção apenas pelo próprio usuário
CREATE POLICY "Usuários podem inserir apenas seus próprios perfis"
  ON profile_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para exclusão apenas pelo próprio usuário
CREATE POLICY "Usuários podem deletar apenas seus próprios perfis"
  ON profile_settings FOR DELETE
  USING (auth.uid() = user_id); 