<div align="center">

# 🎵 Beatfy - Music Player

[![Platform](https://img.shields.io/badge/platform-Android-3DDC84.svg?style=flat-square&logo=android)](https://developer.android.com)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-~54.0.10-000020.svg?style=flat-square&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

**Uma experiência musical completa e personalizada para dispositivos Android**

*Reproduza músicas locais, explore conteúdo online, ouça rádio ao vivo e muito mais*

[Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Tecnologias](#-stack-utilizada) • [Contribuição](#-contribuição)

</div>

---

## 📱 Sobre o Projeto

Beatfy é um player de música moderno e intuitivo, desenvolvido com React Native e Expo, que oferece uma experiência musical completa. O aplicativo combina reprodução de músicas locais com recursos avançados de descoberta musical online, rádio digital e gerenciamento personalizado de playlists.

### ✨ Destaques

- 🎯 **Interface Intuitiva**: Design moderno e responsivo inspirado nos melhores players do mercado
- 🔍 **Busca Inteligente**: Encontre suas músicas favoritas rapidamente
- 📱 **Experiência Mobile**: Otimizado especificamente para dispositivos Android
- 🎨 **Personalização**: Temas e configurações adaptáveis ao usuário

---

## 🚀 Funcionalidades

### 🎵 **Player Principal**
- Reprodução de músicas locais do dispositivo
- Controles avançados (play, pause, próxima, anterior)
- Barra de progresso interativa com seek
- Controle de volume integrado

### 🌐 **Conteúdo Online**
- Busca e reprodução de músicas via API
- Integração com serviços de streaming

### 📻 **Rádio Digital**
- Transmissão de rádio ao vivo
- Qualidade de áudio otimizada

### 📝 **Recursos Avançados**
- Exibição de letras sincronizadas
- Sistema de favoritos
- Histórico de reprodução
- Criação e gerenciamento de playlists personalizadas

### 🔍 **Organização**
- Sistema de busca avançado

---

## 🛠 Stack Utilizada

### **Frontend Mobile**
- **[React Native](https://reactnative.dev/)** `0.81.4` - Framework principal para desenvolvimento mobile
- **[Expo](https://expo.dev/)** `~54.0.10` - Plataforma e ferramentas de desenvolvimento
- **[TypeScript](https://www.typescriptlang.org/)** `5.3.3` - Tipagem estática e melhor DX

### **Gerenciamento de Estado**
- **[Zustand](https://github.com/pmndrs/zustand)** `5.0.5` - State management moderno e leve
- **[React Context API](https://reactjs.org/docs/context.html)** - Gerenciamento de estado local

### **Navegação & UI**
- **[Expo Router](https://expo.github.io/router/)** `~6.0.8` - Sistema de roteamento baseado em arquivos
- **[React Navigation](https://reactnavigation.org/)** `7.x` - Navegação nativa
- **[Expo Vector Icons](https://docs.expo.dev/guides/icons/)** - Biblioteca de ícones

### **Áudio & Media**
- **[Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)** `~16.0.7` - Reprodução de áudio e vídeo
- **[Expo Media Library](https://docs.expo.dev/versions/latest/sdk/media-library/)** `~18.2.0` - Acesso à biblioteca de mídia

### **Persistência & Database**
- **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** `~16.0.8` - Banco de dados local
- **[AsyncStorage](https://github.com/react-native-async-storage/async-storage)** `2.2.0` - Armazenamento local

### **Networking & APIs**
- **[Axios](https://axios-http.com/)** `1.9.0` - Cliente HTTP
- **APIs de Streaming** - Integração com serviços de música online

### **Animações & UX**
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** `~4.1.0` - Animações performáticas
- **[Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)** `~7.3.1` - Animações Lottie

---

### **Padrões Arquiteturais**

- **Component-Based Architecture**: Componentes modulares e reutilizáveis
- **Custom Hooks**: Lógica reutilizável encapsulada em hooks
- **State Management**: Zustand para estado global
- **File-based Routing**: Expo Router para navegação baseada em estrutura de arquivos

---

## 📦 Instalação

### **Pré-requisitos**

- **Node.js** >= 18.0.0
- **npm** ou **pnpm**
- **Android Studio | Expo Go**

### **Configuração do Ambiente**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/PHCavalcante/Beatfy.git
   cd Beatfy
   ```

2. **Instale as dependências**
   ```bash
   # Usando npm
   npm install
   
   # ou usando pnpm (recomendado)
   pnpm install
   ```

### **Executando o Projeto**

```bash
# Inicie o servidor de desenvolvimento
npm start
# ou
pnpm start

# Para executar diretamente no Android
npm run android
# ou
pnpm android
```

### **Build para Produção**

```bash
# Build de desenvolvimento
expo build:android

# Build de produção (requer configuração EAS)
eas build --platform android
```

---

## 📊 Estrutura do Banco de Dados

```sql
-- Músicas principais
CREATE TABLE all_musics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    artist TEXT DEFAULT "Desconhecido(a)",
    url TEXT,
    path TEXT NOT NULL,
    duration REAL
);

-- Histórico de reprodução
CREATE TABLE recent_plays (
    id_music TEXT NOT NULL,
    quantity_plays INTEGER DEFAULT 1,
    FOREIGN KEY (id_music) REFERENCES all_musics(id)
);

-- Músicas favoritas
CREATE TABLE favorite_musics (
    id_music TEXT PRIMARY KEY,
    FOREIGN KEY (id_music) REFERENCES all_musics(id)
);

-- Sistema de playlists
CREATE TABLE playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE playlist_music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    music_id TEXT NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (music_id) REFERENCES all_musics(id)
);
```

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

### **Como Contribuir**

1. **Fork** o projeto
2. **Clone** seu fork: `git clone https://github.com/PHCavalcante/Beatfy.git`
3. **Crie** uma branch para sua feature: `git checkout -b feature/nova-feature`
4. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova feature'`
5. **Push** para a branch: `git push origin feature/nova-feature`
6. **Abra** um Pull Request

### **Padrões de Commit**

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `chore:` Tarefas de manutenção
- ...

### **Reportando Issues**

- Use os templates de issue disponíveis
- Inclua informações sobre o dispositivo e versão do Android
- Adicione logs e screenshots quando relevante

---

## 📄 Licença

Este projeto foi desenvolvido com **fins acadêmicos** como parte de um projeto universitário, e está licenciado através da licença **MIT**.

---

## 📞 Suporte

Encontrou algum problema? Tem alguma sugestão?

- 🐛 [Reporte um bug](https://github.com/PHCavalcante/Beatfy/issues/new?template=bug_report.md)
- 💡 [Sugira uma feature](https://github.com/PHCavalcante/Beatfy/issues/new?template=feature_request.md)

---

<div align="center">

**[⬆ Voltar ao topo](#-beatfy---music-player)**

</div>
