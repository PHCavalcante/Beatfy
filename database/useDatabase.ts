import * as SQLite from "expo-sqlite";

export type MusicInfo = {
  id: string;
  name: string;
  artist?: string;
  url?: string;
  path: string;
  duration?: number;
};
type Playlist = {
  id: number;
  name: string;
};
type PlaylistWithMusics = {
  playlist: Playlist;
  musics: MusicInfo[];
};
export async function useDatabase() {
  const database = await SQLite.openDatabaseAsync("beatfy.db");

  async function queryRecentPlaysMusics() {
    const queryWithJoin =
      "SELECT DISTINCT all_musics.id, all_musics.name, all_musics.artist, all_musics.url, all_musics.path," +
      "all_musics.duration FROM recent_plays LEFT JOIN all_musics ON recent_plays.id_music = all_musics.id ORDER BY recent_plays.quantity_plays DESC";
    try {
      const response = await database.getAllAsync<MusicInfo>(queryWithJoin);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function queryRandomAllMusics() {
    try {
      const response = await database.getAllAsync<MusicInfo>(
        "SELECT * FROM all_musics ORDER BY RANDOM() LIMIT 10"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function existsDataOnAllMusicTable() {
    try {
      const response = await database.getAllAsync(`SELECT * FROM all_musics`);
      if (response.length > 0) return true;
      return false;
    } catch (error) {
      throw error;
    }
  }

  async function existsDataOnRecentPlays(id_music: string) {
    try {
      const response = await database.getFirstAsync(
        "SELECT * FROM recent_plays WHERE id_music = $id_music",
        { $id_music: id_music }
      );
      return !!response;
    } catch (error) {
      throw error;
    }
  }

  async function insertInAllMusicsTable(musicInfo: MusicInfo) {
    const statement = await database.prepareAsync(
      "INSERT INTO all_musics(id, name, artist, url, path, duration) VALUES ($id, $name, $artist, $url, $path, $duration)"
    );

    try {
      await statement.executeAsync({
        $id: musicInfo.id,
        $name: musicInfo.name,
        $artist: musicInfo.artist ? musicInfo.artist : null,
        $url: musicInfo.url ? musicInfo.url : null,
        $path: musicInfo.path,
        $duration: musicInfo.duration ? musicInfo.duration : null,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function insertInRecentPlaysTable(id_music: string) {
    const statement = await database.prepareAsync(
      "INSERT INTO recent_plays(id_music, quantity_plays) VALUES ($id_music, 1)"
    );

    try {
      await statement.executeAsync({
        $id_music: id_music,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function incrementQuantityPlays(id_music: string) {
    try {
      const quantityPlays = await database.getFirstAsync<{
        quantity_plays: number;
      }>(
        "SELECT quantity_plays FROM recent_plays WHERE id_music = $id_music",
        { $id_music: id_music }
      );
      if (quantityPlays) {
        const increment = quantityPlays.quantity_plays + 1;
        await database.runAsync(
          "UPDATE recent_plays SET quantity_plays = $increment WHERE id_music = $id_music",
          { $increment: increment, $id_music: id_music }
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async function addFavoriteMusic(id_music: string) {
    const statement = await database.prepareAsync(
      "INSERT INTO favorite_musics(id_music) VALUES ($id_music)"
    );

    try {
      await statement.executeAsync({ $id_music: id_music });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function removeFavoriteMusic(id_music: string) {
    try {
      await database.runAsync(
        `DELETE FROM favorite_musics WHERE id_music = $id_music`,
        {
          $id_music: id_music,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async function isFavoriteMusic(id_music: string) {
    try {
      const result = await database.getFirstAsync(
        `SELECT * FROM favorite_musics WHERE id_music = $id_music`,
        {
          $id_music: id_music,
        }
      );

      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async function queryFavoriteMusics() {
    const query = `
            SELECT all_musics.id, all_musics.name, all_musics.artist, all_musics.url, all_musics.path, all_musics.duration 
            FROM favorite_musics 
            LEFT JOIN all_musics ON favorite_musics.id_music = all_musics.id
        `;

    const response = await database.getAllAsync<MusicInfo>(query);
    return response;
  }
  async function createPlaylist(name: string) {
    const statement = await database.prepareAsync(
      "INSERT INTO playlists(name) VALUES ($name)"
    );

    try {
      await statement.executeAsync({ $name: name });
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function queryAllPlaylists(): Promise<Playlist[]> {
    return await database.getAllAsync<Playlist>("SELECT * FROM playlists");
  }
  async function addMusicToPlaylist(playlistId: number, musicId: string) {
    const statement = await database.prepareAsync(
      "INSERT INTO playlist_music(playlist_id, music_id) VALUES ($playlistId, $musicId)"
    );

    try {
      await statement.executeAsync({
        $playlistId: playlistId,
        $musicId: musicId,
      });
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function getMusicsFromPlaylist(
    playlistId: number
  ): Promise<MusicInfo[]> {
    const query = ` 
    SELECT all_musics.id, all_musics.name, all_musics.artist, all_musics.url, all_musics.path, all_musics.duration
    FROM playlist_music
    LEFT JOIN all_musics ON playlist_music.music_id = all_musics.id
    WHERE playlist_music.playlist_id = $playlistId
  `;

    return await database.getAllAsync<MusicInfo>(query, {
      $playlistId: playlistId,
    });
  }
  async function removeMusicFromPlaylist(playlistId: number, musicId: string) {
    await database.runAsync(
      "DELETE FROM playlist_music WHERE playlist_id = $playlistId AND music_id = $musicId",
      { $playlistId: playlistId, $musicId: musicId }
    );
  }
  async function getSongCountInPlaylist(playlistId: number): Promise<number> {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM playlist_music WHERE playlist_id = $playlistId`,
      { $playlistId: playlistId }
    );
    return result?.count ?? 0;
  }
  async function isMusicInPlaylist(
    playlistId: number,
    musicId: string
  ): Promise<boolean> {
    try {
      const result = await database.getFirstAsync(
        `SELECT * FROM playlist_music WHERE playlist_id = $playlistId AND music_id = $musicId`,
        {
          $playlistId: playlistId,
          $musicId: musicId,
        }
      );

      return !!result;
    } catch (error) {
      throw error;
    }
  }
  async function deletePlaylist(playlistId: number) {
    await database.runAsync(
      "DELETE FROM playlist_music WHERE playlist_id = $playlistId",
      { $playlistId: playlistId }
    );

    await database.runAsync("DELETE FROM playlists WHERE id = $playlistId", {
      $playlistId: playlistId,
    });
  }

  return {
    queryRecentPlaysMusics,
    queryRandomAllMusics,
    existsDataOnAllMusicTable,
    existsDataOnRecentPlays,
    insertInAllMusicsTable,
    insertInRecentPlaysTable,
    incrementQuantityPlays,
    addFavoriteMusic,
    removeFavoriteMusic,
    isFavoriteMusic,
    queryFavoriteMusics,
    createPlaylist,
    queryAllPlaylists,
    addMusicToPlaylist,
    getMusicsFromPlaylist,
    removeMusicFromPlaylist,
    getSongCountInPlaylist,
    isMusicInPlaylist,
    deletePlaylist
  };
}