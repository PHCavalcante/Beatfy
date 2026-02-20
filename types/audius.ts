export interface AudiusUser {
  id: string;
  name: string;
  handle: string;
  profile_picture?: {
    "150x150"?: string;
    "480x480"?: string;
    "1000x1000"?: string;
  };
}

export interface AudiusTrack {
  id: string;
  title: string;
  user: AudiusUser;
  artwork?: {
    "150x150"?: string;
    "480x480"?: string;
    "1000x1000"?: string;
  };
}

export interface AudiusPlaylist {
  id: string;
  playlist_name: string;
  artwork?: {
    "150x150"?: string;
    "480x480"?: string;
  };
}

export interface AudiusApiResponse<T> {
  data: T[];
}
