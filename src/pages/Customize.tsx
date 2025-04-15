import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/integrations/auth/AuthContext';
import { motion } from 'framer-motion';

// Interface para tipar corretamente o objeto social_links
interface SocialLinks {
    instagram: string;
    tiktok: string;
    discord: string;
    spotify: string;
}

// Interface para a resposta do Supabase
interface ProfileSettingsResponse {
    id: number;
    profile_image_url: string;
    banner_image_url: string;
    music_url: string;
    music_file?: string;
    bio: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: any; // Aceitamos qualquer formato do banco de dados
    theme_color: string;
    social_links: Record<string, unknown>;
    username: string;
}

type ProfileSettings = {
    profileImageUrl: string;
    bannerImageUrl: string;
    musicUrl: string;
    musicFile: string;
    bio: string;
    tags: Tag[];
    themeColor: string;
    socialLinks: SocialLinks;
    starIcon: string;
    verifiedIcon: string;
    username: string;
};

// Função utilitária para normalizar uma tag em qualquer formato
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeTag = (tag: any): Tag => {
    // Se for uma string que parece ser JSON
    if (typeof tag === 'string' && (tag.startsWith('{') || tag.startsWith('['))) {
        try {
            const parsed = JSON.parse(tag);

            // Se for um objeto com a estrutura esperada
            if (parsed && typeof parsed === 'object' && 'text' in parsed) {
                return {
                    text: parsed.text || '',
                    icon: parsed.icon || ''
                };
            }
            // Caso contrário, usa a string como texto
            return { text: tag, icon: '' };
        } catch (e) {
            return { text: tag, icon: '' };
        }
    }

    // Se já for um objeto
    if (typeof tag === 'object' && tag !== null) {
        return {
            text: typeof tag.text === 'string' ? tag.text : String(tag.text || tag),
            icon: typeof tag.icon === 'string' ? tag.icon : ''
        };
    }

    // Para qualquer outro caso, converte para string
    return { text: String(tag), icon: '' };
};

// Debug Helper para ver formato das tags
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debugTag = (tag: any) => {
    console.log('Tipo da tag:', typeof tag);
    console.log('Conteúdo da tag:', tag);
    if (typeof tag === 'string') {
        try {
            console.log('Tentando parsear JSON:', JSON.parse(tag));
        } catch (e) {
            console.log('Não é JSON válido');
        }
    }
};

// Função personalizada para obter texto simplificado da tag
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTagDisplayText = (tag: any): string => {
    // Se for string, verifica se é JSON
    if (typeof tag === 'string') {
        try {
            const parsed = JSON.parse(tag);
            if (parsed && typeof parsed === 'object' && 'text' in parsed) {
                return parsed.text;
            }
            return tag;
        } catch (e) {
            // Não é JSON, retorna a string diretamente
            return tag;
        }
    }

    // Se for objeto com propriedade text
    if (tag && typeof tag === 'object' && 'text' in tag) {
        return tag.text;
    }

    // Fallback - converte para string
    return String(tag || '');
};

// Função personalizada para obter ícone da tag
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTagDisplayIcon = (tag: any): string => {
    // Se for string, verifica se é JSON
    if (typeof tag === 'string') {
        try {
            const parsed = JSON.parse(tag);
            if (parsed && typeof parsed === 'object' && 'icon' in parsed) {
                return parsed.icon;
            }
            return '';
        } catch (e) {
            // Não é JSON
            return '';
        }
    }

    // Se for objeto com propriedade icon
    if (tag && typeof tag === 'object' && 'icon' in tag) {
        return tag.icon;
    }

    // Fallback
    return '';
};

const Customize = () => {
    const [settings, setSettings] = useState<ProfileSettings>({
        profileImageUrl: '',
        bannerImageUrl: '',
        musicUrl: '',
        musicFile: '',
        bio: '',
        tags: [],
        themeColor: '#8B5CF6', // Cor padrão (roxo)
        socialLinks: {
            instagram: '',
            tiktok: '',
            discord: '',
            spotify: ''
        },
        starIcon: '☆',
        verifiedIcon: '/verificado.png',
        username: ''
    });

    const [newTag, setNewTag] = useState('');
    const [newTagIcon, setNewTagIcon] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [isUploadingTagIcon, setIsUploadingTagIcon] = useState(false);
    const { signOut, user } = useAuth();
    const [isNewUser, setIsNewUser] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Função utilitária para formatar links
    const formatLink = (link: string, type?: 'instagram' | 'tiktok' | 'discord' | 'spotify'): string => {
        if (!link || link.trim() === '') return '';

        // Se já for uma URL completa com formato correto, verificar se tem https://
        if (link.match(/^(https?:\/\/)?(www\.)?(instagram\.com|tiktok\.com|discord\.gg|open\.spotify\.com)/)) {
            // Garantir que comece com https://
            return link.match(/^https?:\/\//) ? link : `https://${link}`;
        }

        // Remover qualquer https:// ou http:// existente e qualquer espaço
        const cleanUsername = link.replace(/^https?:\/\//, '').trim();

        // Remover @ inicial se existir
        const usernameWithoutAt = cleanUsername.replace(/^@/, '');

        // Formatar baseado no tipo de rede social
        switch (type) {
            case 'instagram': {
                // Verificar se já tem instagram.com no meio
                if (cleanUsername.includes('instagram.com')) {
                    return `https://${cleanUsername}`;
                }
                return `https://www.instagram.com/${usernameWithoutAt}`;
            }

            case 'tiktok': {
                // Verificar se já tem tiktok.com no meio
                if (cleanUsername.includes('tiktok.com')) {
                    return `https://${cleanUsername}`;
                }

                // Adiciona @ se não existir e formata como tiktok.com/@username
                const tiktokUsername = usernameWithoutAt;
                return `https://www.tiktok.com/@${tiktokUsername}`;
            }

            case 'discord': {
                // Verificar se já tem discord no meio
                if (cleanUsername.includes('discord')) {
                    return `https://${cleanUsername}`;
                }

                // Parece ser um código de convite
                return `https://discord.gg/${usernameWithoutAt}`;
            }

            case 'spotify': {
                // Verificar se já tem spotify no meio
                if (cleanUsername.includes('spotify')) {
                    return `https://${cleanUsername}`;
                }

                // Parece ser um username
                return `https://open.spotify.com/user/${usernameWithoutAt}`;
            }

            default:
                // Formato padrão para outros links
                return `https://${cleanUsername}`;
        }
    };

    // Função para verificar disponibilidade de nome de usuário
    const checkUsernameAvailability = async (username: string) => {
        if (!username) {
            setUsernameAvailable(true);
            return;
        }

        // Verificar se o nome de usuário tem pelo menos 3 caracteres
        if (username.length < 3) {
            setUsernameAvailable(false);
            return;
        }

        // Verificar se o nome de usuário contém apenas caracteres válidos
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            setUsernameAvailable(false);
            return;
        }

        try {
            setIsCheckingUsername(true);
            console.log("Verificando disponibilidade para:", username);

            const { data, error } = await supabase
                .from('profile_settings')
                .select('username, user_id')
                .eq('username', username)
                .neq('user_id', user?.id || '') // Ignorar o usuário atual
                .maybeSingle();

            if (error) {
                // Ignorar erro específico de "não encontrado", isso significa que o nome está disponível
                if (error.code === 'PGRST116') {
                    console.log('Nome de usuário disponível (não encontrado no banco)');
                    setUsernameAvailable(true);
                    return;
                }

                console.error('Erro ao verificar nome de usuário:', error);
                toast.error(`Erro ao verificar disponibilidade: ${error.message}`);
                setUsernameAvailable(false);
                return;
            }

            console.log("Resultado da verificação:", data);

            // Se data existe, significa que o nome de usuário já está em uso
            const isAvailable = !data;
            console.log("Nome está disponível?", isAvailable);
            setUsernameAvailable(isAvailable);

            if (!isAvailable) {
                toast.error(`O nome "${username}" já está em uso por outro usuário`);
            } else {
                toast.success(`O nome "${username}" está disponível!`);
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
            toast.error('Falha ao verificar disponibilidade');
            setUsernameAvailable(false);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    // Buscar configurações existentes
    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                // Buscar configurações baseadas no ID do usuário autenticado
                const { data, error } = await supabase
                    .from('profile_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                // Se não encontrar dados (erro PGRST116 = "não encontrado"), considerar usuário novo
                if (error && error.code === 'PGRST116') {
                    console.log('Novo usuário detectado, mostrando interface vazia');
                    setIsNewUser(true);
                    setIsLoading(false);
                    return;
                } else if (error) {
                    console.error('Erro ao carregar configurações:', error);
                    setIsLoading(false);
                    return;
                }

                if (data) {
                    const profileData = data as ProfileSettingsResponse;

                    const socialLinks = {
                        instagram: '',
                        tiktok: '',
                        discord: '',
                        spotify: ''
                    };

                    if (profileData.social_links && typeof profileData.social_links === 'object') {
                        const links = profileData.social_links as Record<string, unknown>;

                        if (typeof links.instagram === 'string') socialLinks.instagram = formatLink(links.instagram, 'instagram');
                        if (typeof links.tiktok === 'string') socialLinks.tiktok = formatLink(links.tiktok, 'tiktok');
                        if (typeof links.discord === 'string') socialLinks.discord = formatLink(links.discord, 'discord');
                        if (typeof links.spotify === 'string') socialLinks.spotify = formatLink(links.spotify, 'spotify');
                    }

                    // Converter as tags para o novo formato se necessário
                    let formattedTags: Tag[] = [];
                    if (profileData.tags) {
                        try {
                            // Se tags for um array, processa cada item
                            if (Array.isArray(profileData.tags)) {
                                formattedTags = profileData.tags.map(tag => normalizeTag(tag));
                            }
                            // Se não for array, tenta converter
                            else {
                                formattedTags = [normalizeTag(profileData.tags)];
                            }

                            console.log('Tags processadas:', formattedTags);
                        } catch (error) {
                            console.error('Erro ao processar tags:', error);
                            formattedTags = [];
                        }
                    }

                    console.log('Social links carregados:', socialLinks);

                    setSettings({
                        profileImageUrl: profileData.profile_image_url || '',
                        bannerImageUrl: profileData.banner_image_url || '',
                        musicUrl: profileData.music_url || '',
                        musicFile: profileData.music_file || '',
                        bio: profileData.bio || '',
                        tags: formattedTags,
                        themeColor: profileData.theme_color || '#8B5CF6',
                        socialLinks: socialLinks,
                        starIcon: '☆',
                        verifiedIcon: '/verificado.png',
                        username: profileData.username || ''
                    });

                    console.log('Dados originais do banco (tags):', profileData.tags);
                }
            } catch (error) {
                console.error('Erro:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [user]);

    // Atualizar o evento handleInputChange para incluir verificação de nome de usuário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(`Campo alterado: ${name}, valor: ${value}`);

        if (name === 'username') {
            // Converter para minúsculas e remover caracteres especiais
            const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
            setSettings(prev => ({ ...prev, username: sanitizedValue }));

            // Verificar disponibilidade do nome de usuário após um pequeno atraso
            const timeoutId = setTimeout(() => {
                checkUsernameAvailability(sanitizedValue);
            }, 500);

            return () => clearTimeout(timeoutId);
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            if (parent === 'socialLinks') {
                // Apenas armazenar o valor digitado sem formatação prévia
                setSettings(prev => {
                    const updatedSocialLinks = {
                        ...prev.socialLinks,
                        [child]: value.trim() // Apenas remover espaços extras
                    };

                    console.log('Social links atualizados:', updatedSocialLinks);

                    return {
                        ...prev,
                        socialLinks: updatedSocialLinks
                    };
                });
            }
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !settings.tags.some(tag => tag.text === newTag.trim())) {
            setSettings(prev => ({
                ...prev,
                tags: [...prev.tags, { text: newTag.trim(), icon: newTagIcon.trim() }]
            }));
            setNewTag('');
            setNewTagIcon('');
        }
    };

    const handleRemoveTag = (tagToRemove: Tag) => {
        setSettings(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag.text !== tagToRemove.text)
        }));
    };

    const handleColorChange = (color: string) => {
        setSettings(prev => ({
            ...prev,
            themeColor: color
        }));
    };

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner' | 'music') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        let bucket = 'profileimages';

        // Use um bucket específico para arquivos de áudio
        if (type === 'music') {
            bucket = 'audio';
        }

        try {
            setIsLoading(true);

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file);

            if (error) {
                toast.error(`Erro ao fazer upload: ${error.message}`);
                return;
            }

            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            if (type === 'profile') {
                setSettings(prev => ({ ...prev, profileImageUrl: urlData.publicUrl }));
            } else if (type === 'banner') {
                setSettings(prev => ({ ...prev, bannerImageUrl: urlData.publicUrl }));
            } else if (type === 'music') {
                setSettings(prev => ({ ...prev, musicFile: urlData.publicUrl }));
            }

            const typeLabel = type === 'profile' ? 'perfil' : type === 'banner' ? 'banner' : 'música';
            toast.success(`Arquivo de ${typeLabel} enviado com sucesso!`);
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            toast.error('Falha ao enviar arquivo.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper para simplificar tags ao salvar no banco
    const prepareTagsForDB = (tags: Tag[]): Record<string, string>[] => {
        // Primeiro verifica se já não temos strings JSON
        return tags.map(tag => {
            // Se por acaso for uma string, tenta interpretar
            if (typeof tag === 'string') {
                try {
                    const parsed = JSON.parse(tag);
                    return {
                        text: parsed.text || String(parsed),
                        icon: parsed.icon || ''
                    };
                } catch (e) {
                    return { text: tag, icon: '' };
                }
            }

            // Já que é um objeto, garante que só tem text e icon
            return {
                text: String(tag.text || ''),
                icon: String(tag.icon || '')
            };
        });
    };

    const handleSaveSettings = async () => {
        if (!user) {
            toast.error('Usuário não autenticado');
            return;
        }

        // Verificar se o nome de usuário está válido e disponível
        if (settings.username) {
            if (settings.username.length < 3) {
                toast.error('Nome de usuário deve ter pelo menos 3 caracteres');
                return;
            }

            if (!/^[a-zA-Z0-9_-]+$/.test(settings.username)) {
                toast.error('Nome de usuário pode conter apenas letras, números, hífens e underscores');
                return;
            }

            if (!usernameAvailable) {
                toast.error('Este nome de usuário já está em uso');
                return;
            }
        }

        try {
            setIsLoading(true);

            console.log('Salvando configurações:', settings);
            console.log('Redes sociais para salvar:', settings.socialLinks);

            // Garantir que todos os links estejam formatados corretamente antes de salvar
            const formattedSocialLinks = {
                instagram: formatLink(settings.socialLinks.instagram, 'instagram'),
                tiktok: formatLink(settings.socialLinks.tiktok, 'tiktok'),
                discord: formatLink(settings.socialLinks.discord, 'discord'),
                spotify: formatLink(settings.socialLinks.spotify, 'spotify')
            };

            console.log('Links formatados para salvar:', formattedSocialLinks);

            // Preparar as tags para salvar
            console.log('Tags antes de salvar:', settings.tags);
            const preparedTags = prepareTagsForDB(settings.tags);
            console.log('Tags preparadas para salvar:', preparedTags);

            // Verificar se é um usuário novo (primeira vez salvando)
            if (isNewUser) {
                // Inserir novo registro associado ao ID do usuário
                const { error: insertError } = await supabase
                    .from('profile_settings')
                    .insert({
                        user_id: user.id, // Associar ao usuário autenticado
                        username: settings.username,
                        profile_image_url: settings.profileImageUrl,
                        banner_image_url: settings.bannerImageUrl,
                        music_url: settings.musicUrl,
                        music_file: settings.musicFile,
                        bio: settings.bio,
                        tags: preparedTags,
                        theme_color: settings.themeColor,
                        social_links: formattedSocialLinks,
                        star_icon: settings.starIcon,
                        verified_icon: settings.verifiedIcon
                    });

                if (insertError) {
                    console.error('Erro ao inserir configurações:', insertError);
                    toast.error(`Erro ao salvar configurações: ${insertError.message}`);
                    return;
                }

                // Não é mais um usuário novo após primeiro salvamento
                setIsNewUser(false);
                toast.success('Perfil criado com sucesso!');
            } else {
                // Atualizar registro existente
                const { error: updateError } = await supabase
                    .from('profile_settings')
                    .update({
                        username: settings.username,
                        profile_image_url: settings.profileImageUrl,
                        banner_image_url: settings.bannerImageUrl,
                        music_url: settings.musicUrl,
                        music_file: settings.musicFile,
                        bio: settings.bio,
                        tags: preparedTags,
                        theme_color: settings.themeColor,
                        social_links: formattedSocialLinks,
                        star_icon: settings.starIcon,
                        verified_icon: settings.verifiedIcon
                    })
                    .eq('user_id', user.id);

                if (updateError) {
                    console.error('Erro ao atualizar configurações:', updateError);
                    toast.error(`Erro ao salvar configurações: ${updateError.message}`);
                    return;
                }

                toast.success('Configurações salvas com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            toast.error('Falha ao salvar configurações.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadTagIcon = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `tagicon_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const bucket = 'tagicons';

        try {
            setIsUploadingTagIcon(true);

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file);

            if (error) {
                toast.error(`Erro ao fazer upload: ${error.message}`);
                return;
            }

            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            setNewTagIcon(urlData.publicUrl);
            toast.success('Ícone enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            toast.error('Falha ao enviar ícone.');
        } finally {
            setIsUploadingTagIcon(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logout realizado com sucesso');
        } catch (error) {
            toast.error('Erro ao fazer logout');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black text-white overflow-x-hidden">
            {/* Barra de navegação melhorada */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-lg px-6 py-4 flex justify-between items-center z-50 shadow-lg border-b border-white/10"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
                >
                    Personalizar Perfil
                </motion.h1>
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/profile">
                            <Button variant="outline" size="sm" className="bg-black/40 border border-white/20 hover:bg-purple-900/30 transition-all duration-300 hover:border-purple-400/40 group">
                                <User className="w-4 h-4 mr-2 group-hover:text-purple-400 transition-colors" />
                                <span className="group-hover:text-purple-400 transition-colors">Ver Perfil</span>
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="bg-black/40 border border-white/20 hover:bg-red-900/30 transition-all duration-300 hover:border-red-400/40 group"
                        >
                            <LogOut className="w-4 h-4 mr-2 group-hover:text-red-400 transition-colors" />
                            <span className="group-hover:text-red-400 transition-colors">Sair</span>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Conteúdo principal com animações */}
            <div className="container mx-auto py-8 px-4 text-white pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 max-w-3xl mx-auto"
                >
                    {/* Seção de nome de usuário para URL personalizada */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            URL Personalizada
                        </h2>

                        <div className="space-y-2">
                            <Label htmlFor="username">Nome de usuário</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="username"
                                    name="username"
                                    value={settings.username}
                                    onChange={handleInputChange}
                                    placeholder="seu-nome"
                                    className={`flex-1 ${!usernameAvailable ? 'border-red-500' : ''}`}
                                    maxLength={30}
                                />
                                {isCheckingUsername && (
                                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {settings.username && !isCheckingUsername && (
                                    <span className={usernameAvailable ? "text-green-500" : "text-red-500"}>
                                        {usernameAvailable ? '✓ Disponível' : '✗ Indisponível'}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-400">
                                {settings.username && (
                                    <div className="mt-2">
                                        <p>Seu perfil estará disponível em:</p>
                                        <p className="font-mono bg-black/40 p-1 rounded mt-1">
                                            {window.location.origin}/p/{settings.username}
                                        </p>
                                    </div>
                                )}
                                <p className="mt-2">Use apenas letras, números, hífens e underscores. Mínimo de 3 caracteres.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Foto de Perfil */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Foto de Perfil
                        </h2>

                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                                <img
                                    src={settings.profileImageUrl || '/fallback-profile.png'}
                                    alt="Foto de perfil"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <Label htmlFor="profileImage">Escolha uma nova foto</Label>
                                <Input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUploadFile(e, 'profile')}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Banner
                        </h2>

                        <div className="space-y-4">
                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/20">
                                <img
                                    src={settings.bannerImageUrl || '/fallback-banner.png'}
                                    alt="Banner"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bannerImage">Escolha um banner</Label>
                                <Input
                                    id="bannerImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUploadFile(e, 'banner')}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Biografia
                        </h2>

                        <Textarea
                            name="bio"
                            value={settings.bio}
                            onChange={handleInputChange}
                            placeholder="Escreva uma pequena biografia sobre você..."
                            className="resize-none h-24"
                        />
                    </motion.div>

                    {/* Seção de Música */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Música de Fundo
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="musicFile">Upload de arquivo de áudio</Label>
                                <Input
                                    id="musicFile"
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => handleUploadFile(e, 'music')}
                                    className="mt-1"
                                />
                            </div>

                            {settings.musicFile && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400 mb-1">Arquivo atual:</p>
                                    <div className="flex items-center gap-2 p-2 bg-black/40 rounded-md">
                                        <audio src={settings.musicFile} controls className="w-full" />
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <Label htmlFor="musicUrl">Ou use um link externo</Label>
                                <Input
                                    id="musicUrl"
                                    name="musicUrl"
                                    value={settings.musicUrl}
                                    onChange={handleInputChange}
                                    placeholder="Link para a música (YouTube, SoundCloud, etc)"
                                />
                                <p className="text-sm text-gray-400 mt-1">
                                    Se ambos estiverem preenchidos, o arquivo terá prioridade
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Tags */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Tags
                        </h2>

                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {settings.tags.map((tag, index) => {
                                    const displayText = getTagDisplayText(tag);
                                    const displayIcon = getTagDisplayIcon(tag);

                                    return (
                                        <div key={index} className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 border border-white/20">
                                            {displayIcon && (
                                                <img
                                                    src={displayIcon}
                                                    alt={`Ícone ${displayText}`}
                                                    className="w-4 h-4 mr-1"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            )}
                                            <span>{displayText}</span>
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="w-4 h-4 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Nova tag..."
                                        className="w-full"
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTagIcon}
                                            onChange={(e) => setNewTagIcon(e.target.value)}
                                            placeholder="URL do ícone"
                                            className="flex-1"
                                        />
                                        <div className="relative">
                                            <Input
                                                id="tagIconUpload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleUploadTagIcon}
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                disabled={isUploadingTagIcon}
                                                className="h-10 w-10"
                                            >
                                                {isUploadingTagIcon ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                                                        <path d="M18 9V4"></path>
                                                        <path d="M15 7h6"></path>
                                                        <circle cx="9" cy="9" r="2"></circle>
                                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                                    </svg>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleAddTag} variant="secondary">Adicionar</Button>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Adicione a URL do ícone ou faça upload de uma imagem
                                </p>
                                {newTagIcon && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-400">Pré-visualização:</p>
                                        <div className="p-1 bg-black/40 rounded">
                                            <img
                                                src={newTagIcon}
                                                alt="Preview"
                                                className="w-6 h-6"
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Redes Sociais */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Redes Sociais
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    name="socialLinks.instagram"
                                    value={settings.socialLinks.instagram}
                                    onChange={handleInputChange}
                                    placeholder="https://instagram.com/seu_usuario"
                                />
                            </div>

                            <div>
                                <Label htmlFor="tiktok">TikTok</Label>
                                <Input
                                    id="tiktok"
                                    name="socialLinks.tiktok"
                                    value={settings.socialLinks.tiktok}
                                    onChange={handleInputChange}
                                    placeholder="https://tiktok.com/@seu_usuario"
                                />
                            </div>

                            <div>
                                <Label htmlFor="discord">Discord</Label>
                                <Input
                                    id="discord"
                                    name="socialLinks.discord"
                                    value={settings.socialLinks.discord}
                                    onChange={handleInputChange}
                                    placeholder="https://discord.gg/seu_servidor"
                                />
                            </div>

                            <div>
                                <Label htmlFor="spotify">Spotify</Label>
                                <Input
                                    id="spotify"
                                    name="socialLinks.spotify"
                                    value={settings.socialLinks.spotify}
                                    onChange={handleInputChange}
                                    placeholder="https://open.spotify.com/user/seu_usuario"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Cores */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Cores do Tema
                        </h2>

                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="w-10 h-10 rounded-full cursor-pointer border border-white/20"
                                    style={{ backgroundColor: settings.themeColor }}
                                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                                />
                                <span>Cor selecionada: {settings.themeColor}</span>
                            </div>

                            {colorPickerOpen && (
                                <div className="mb-4">
                                    <HexColorPicker
                                        color={settings.themeColor}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Seção de Ícones Personalizados */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        whileHover={{ y: -5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mr-3 rounded-full"></span>
                            Ícones Personalizados
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="starIcon">Ícone de Estrela</Label>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="starIcon"
                                            name="starIcon"
                                            value={settings.starIcon}
                                            onChange={handleInputChange}
                                            className="w-20"
                                            placeholder="☆"
                                        />
                                        <div
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40"
                                            style={{ color: settings.themeColor }}
                                        >
                                            <span className="text-2xl">{settings.starIcon}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="verifiedIcon">Ícone de Verificado</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    <Input
                                        id="verifiedIcon"
                                        name="verifiedIcon"
                                        value={settings.verifiedIcon}
                                        onChange={handleInputChange}
                                        placeholder="/verificado.png"
                                        className="flex-1"
                                    />
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40">
                                        <img
                                            src={settings.verifiedIcon}
                                            alt="Verificado"
                                            className="w-6 h-6"
                                            onError={(e) => (e.currentTarget.src = '/verificado.png')}
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSettings(prev => ({ ...prev, verifiedIcon: '/verificado.png' }))}
                                    >
                                        Restaurar Padrão
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    Para alterar o ícone, faça upload de uma imagem e use a URL
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Botão de Salvar melhorado */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-end"
                        whileHover={{ scale: 1.03 }}
                    >
                        <Button
                            onClick={handleSaveSettings}
                            disabled={isLoading}
                            className="px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                                    Salvando...
                                </span>
                            ) : "Salvar alterações"}
                        </Button>
                    </motion.div>

                    {/* Indicador de rolagem */}
                    <div className="fixed bottom-6 right-6 z-50 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-white/60 mb-1">Rolar</span>
                            <div className="w-6 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-1.5 h-3 bg-purple-500 rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Customize; 