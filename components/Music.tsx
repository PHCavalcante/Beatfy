import { View, Text, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { usePlayTrack } from "@/store/playerSelectors";
import { Track } from "@/store/playerStore";
import { useThemeColors } from "@/hooks/useThemeColor";

type Props = {
    id?: string;
    name?: string;
    artist?: string;
    url: ImageSourcePropType;
    mode?: "horizontal" | "vertical" | "grid" | "local";
    path?: string;
    onPress?: () => void;
    colors?: any
};


export default function Music({ name, url, artist, mode = "horizontal", path, id, onPress, colors }: Props) {
    if (mode === "horizontal") {
        return <HorizontalMusicIcon name={name} url={url} />
    } else if (mode == "vertical") {
        return <VerticalMusicIcon name={name} artist={artist} url={url} />
    } else if (mode == "grid") {
        return <GridMusicIcon name={name} artist={artist} url={url} path={path} id={id} colors={colors} onPress={onPress}/>
    } else {
        return <LocalMusicIcon infoItem={{ id: id ?? "", uri: path ?? "", name: name ?? "Unknown", artist }} playlist={[]} colors={colors} />
    }
}
function HorizontalMusicIcon({ name, url }: { name?: string; url: ImageSourcePropType }) {
    return (
        <TouchableOpacity style={styles.songHorizontal}>
            <Image source={url} style={styles.styleFoto} />
            <Text style={styles.songTitleHorizontal}>{name}</Text>
        </TouchableOpacity>
    );
}
function VerticalMusicIcon({ name, url, artist }: { name?: string; url: ImageSourcePropType; artist?: string }) {
    return (
        <View>
            <TouchableOpacity style={styles.songVertical}>
                <Image source={url} style={styles.styleFoto} />
                <View style={{ borderColor: "white", margin: 15 }}>
                    <Text style={styles.songTitleVertical}>{name}</Text>
                    <Text style={styles.songSubTitleVertical}>{artist}</Text>
                </View>
            </TouchableOpacity>
        </View>

    );
}
function GridMusicIcon({ name, url, artist, path, id, onPress }: Props) {
    const color = useThemeColors();
    const playTrack = usePlayTrack();

    const handlePress = async () => {
        if (onPress) {
            onPress();
        } else {
            const assets = await MediaLibrary.getAssetsAsync({ mediaType: "audio", first: 300 });
            playTrack(
                { id: id ?? "", uri: path ?? "", name: name!.split(".")[0], artist },
                assets.assets.map((asset) => ({
                    id: asset.id,
                    uri: asset.uri,
                    name: asset.filename ? asset.filename.split(".")[0] : "Unknown",
                    url: asset.albumId
                        ? `album-${asset.albumId}`
                        : require("../assets/icons/default-song.png"),
                    image: require("../assets/icons/default-song.png"),
                })) as Track[]
            );
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.songGrid}>
            <View style={{ flex: 1, alignItems: "center" }}>
                <View style={styles.fotoGridContainer}>
                    <Image source={url} style={styles.styleFotoGrid} />
                </View>
                <Text style={[styles.songTitleGrid, { color: color.text }]} numberOfLines={3}>
                    {name?.split(".")[0]}
                </Text>
                <Text style={[styles.songSubTitleGrid, { color: color.textSecondary }]} numberOfLines={1}>
                    {artist}
                </Text>

            </View>
        </TouchableOpacity>
    );
}
export function LocalMusicIcon({ infoItem, playlist, colors,  }: { infoItem?: Track; playlist?: Track[]; colors?: any }) {
    const name = infoItem?.name?.split(".")[0];
    const playTrack = usePlayTrack();
    return (
        <TouchableOpacity
        onPress={async () => {
            playTrack(infoItem!, playlist);
        }}
          style={{
            width: "100%",
            flexDirection: "row",
            alignContent: "flex-start",
            alignItems: "center",
            justifyContent: "flex-start",
            marginVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ width: 40, height: 40, backgroundColor: "#c1c1c1", alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
            <Image source={infoItem?.image ?? require("@/assets/icons/default-song.png")} style={{ width: 25, height: 25 }} />
          </View>
          <View style={{ flexDirection: "column", paddingLeft: 10,flex:1 }}>
            <Text style={[styles.localTittle, {color: colors.text}]}>{name}</Text>
            <Text style={[styles.localArtistName, {color: colors.textSecondary}]}>{infoItem?.artist}</Text>
          </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    styleFoto: {
        width: 97,
        height: 90,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 10,
        marginVertical: 10
    },
    fotoGridContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 147,
        height: 122,
        backgroundColor: "#C1C1C1",
        borderRadius: 15,
        marginBottom: 10,
    },
    styleFotoGrid: {
        height: 90,
        resizeMode: "center",    

    },
    songHorizontal: {
        marginVertical: 10
    },
    songTitleHorizontal: {
        fontSize: 15,
        color: "white",
        textAlign: "center"
    },
    songVertical: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "65%"

    },
    songTitleVertical: {
        fontSize: 20,
        textAlign: "center",
        color: "white",
    },
    songSubTitleVertical: {
        fontSize: 13,
        textAlign: "center",
        color: "#A19E9E",
    },
    songGrid: {
        width: 147,
    },
    songTitleGrid: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
    },
    songSubTitleGrid: {
        fontSize: 13,
        color: "#A19E9E",
        textAlign: "center"
    },
    localTittle: {
        fontSize: 14,
        textAlign: "left",
        color: "#fff"
    },
    localArtistName: {
        fontSize: 12,
        textAlign: "left",
        color: "#c1c1c1"
    }
})