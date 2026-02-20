import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import GetTrendingSongs from "@/utils/GetTrendings";
import { usePlaySelectedTrackWithFeedback } from "@/hooks/usePlaySelectedTrackWithFeedback";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import LoadingAnimationContainer from "@/components/LoadingAnimationContainer";
import { EmptyState } from "@/components/EmptyState";
import { searchTracks, getErrorMessage } from "@/services/audiusApi";
import type { AudiusTrack } from "@/types/audius";
import { borderRadius, spacing } from "@/theme";

const SEARCH_DEBOUNCE_MS = 400;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [searchResults, setSearchResults] = useState<AudiusTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const playSelectedTrack = usePlaySelectedTrackWithFeedback();
  const colors = useThemeColors();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery.length === 0) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchTracks(debouncedQuery);
        setSearchResults(data);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast(message, "error");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSearchResults();
  }, [debouncedQuery, showToast]);

  if (searchQuery) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <TextInput
          placeholder="O que você está procurando?"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
        />
        {isSearching && <LoadingAnimationContainer />}
        {!isSearching && searchResults.length === 0 && debouncedQuery.length > 0 && (
          <EmptyState
            icon="search-outline"
            title="Nenhum resultado encontrado"
            subtitle={`Não encontramos nada para "${debouncedQuery}"`}
          />
        )}
        <FlatList
          style={styles.resultsList}
          contentContainerStyle={searchResults.length === 0 ? { flex: 1 } : undefined}
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { backgroundColor: colors.surface }]}
              onPress={() =>
                playSelectedTrack(
                  item.id,
                  item.title,
                  item.user.name,
                  item.artwork?.["150x150"] ?? ""
                )
              }
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.artwork?.["150x150"] ?? item.artwork?.["480x480"] }}
                style={styles.resultImage}
              />
              <View style={styles.resultText}>
                <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.user.name}
                </Text>
              </View>
              <View style={[styles.playIcon, { backgroundColor: colors.primary }]}>
                <Text style={styles.playIconText}>▶</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header />
      <TextInput
        placeholder="O que você está procurando?"
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Populares no momento</Text>
          <GetTrendingSongs type={"trending"} colors={colors} setMusicLoading={setIsMusicLoading} />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Populares este mês</Text>
          <GetTrendingSongs type={"monthly"} colors={colors} setMusicLoading={setIsMusicLoading} />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>As mais populares</Text>
          <GetTrendingSongs type={"allTime"} colors={colors} setMusicLoading={setIsMusicLoading} />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Playlists populares</Text>
          <GetTrendingSongs type={"playlists"} colors={colors} setMusicLoading={setIsMusicLoading} />
        </View>
      </ScrollView>
      {isMusicLoading && <LoadingAnimationContainer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  searchInput: {
    width: "90%",
    height: 48,
    borderRadius: borderRadius.lg,
    paddingLeft: spacing.md,
    marginTop: spacing.md,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    marginTop: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
  },
  resultsList: {
    flex: 1,
    width: "100%",
    marginTop: spacing.lg,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultArtist: {
    fontSize: 14,
    marginTop: 2,
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconText: {
    color: "#FFF",
    fontSize: 12,
  },
});
