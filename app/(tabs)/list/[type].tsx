import Header from "@/components/Header";
import Music from "@/components/Music";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useDatabase } from "@/database/useDatabase";
import { useThemeColors } from "@/hooks/useThemeColor";

const mockData = {
    albums: [
        { id: "7", title: "Plastic Beach", image: "https://placecats.com/300/300" },
        { id: "8", title: "True Defiance", image: "https://placecats.com/300/300" },
        { id: "9", title: "20 Super Sucessos", image: "https://placecats.com/300/300" },
    ],
    playlists: [
        { id: "10", title: "Ficar Monstrão", image: "https://placecats.com/300/300" },
        { id: "11", title: "As Melhores Clássicas", image: "https://placecats.com/300/300" },
    ],
};

const titlesPages = {
    recent: "Tocadas recentemente",
    favorites: "Favoritas",
    albums: "Álbuns",
    playlists: "Playlists",
};

const validTypes = ["recent", "favorites", "albums", "playlists"] as const;
type TypeKey = typeof validTypes[number];

export default function PageList() {
    const { type } = useLocalSearchParams();
    const router = useRouter();
    const db = useDatabase();
    const colors = useThemeColors();

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isValidType = typeof type === "string" && validTypes.includes(type as TypeKey);
    const typedType = isValidType ? (type as TypeKey) : "recent";
    const title = titlesPages[typedType];

    useEffect(() => {
        if (!isValidType) return;
        const fetchData = async () => {            
            try {
                const database = await db;
                let data: any[] = [];

                if (typedType === "favorites") {
                    const res = await database.queryFavoriteMusics();
                   // console.log("Favoritas:", res);

                    data = res.map((r: any, index: number) => ({
                        id: String(r.id ?? `${r.name}-${index}`),
                        name: r.name ?? "Sem nome",
                        artist: r.artist ?? "Desconhecido(a)",
                        url: r.url ?? require("../../../assets/icons/default-song.png"),
                        path: r.path ?? "",
                    }));
                } else if (typedType === "recent") {
                    const res = await database.queryRecentPlaysMusics();
                //    console.log("Recentes:", res);

                    data = res.map((r: any, index: number) => ({
                        id: String(r.id ?? `${r.name}-${index}`),
                        name: r.name ?? "Sem nome",
                        artist: r.artist ?? "Desconhecido(a)",
                        url: r.url ?? require("../../../assets/icons/default-song.png"),
                        path: r.path ?? "",
                    }));


                } else {
                    data = mockData[typedType];
                }

                setItems(data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isValidType, typedType, db]);

    if (!isValidType) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
                    Tipo inválido ou não encontrado.
                </Text>
            </SafeAreaView>
        );
    }

    return (

        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header />
            <View style={styles.content}>
                <View style={styles.containerTitlePage}>
                    <TouchableOpacity onPress={() => router.push("../home")}>
                        <AntDesign name="arrowleft" size={29} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={ colors.text } style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        renderItem={({ item, index }) => (
                            <View
                                style={styles.containerViewFlatList}
                            >
                                <Text style={styles.musicTitle}>{item.title}</Text>
                                <Music
                                    key={item.path ?? `${item.name}-${index}`}
                                    mode="grid"
                                    name={item.name}
                                    artist={item.artist}
                                    url={item.url}
                                    path={item.path}
                                    colors={colors}
                                    id={item.id}
                                />
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {        
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
    },
    content: {
        flex: 1,
        width: "100%",
    },
    containerTitlePage: {
        flexDirection: "row",
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 20,        
        paddingHorizontal: 20,
    },
    containerViewFlatList: {
        maxWidth: "50%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    musicTitle: {
        color: "white",
        marginBottom: 10,
        textAlign: "center",
    },
});
