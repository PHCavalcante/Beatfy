import { useCallback } from "react";
import { usePlaySelectedTrack } from "@/store/playerSelectors";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/services/audiusApi";

export function usePlaySelectedTrackWithFeedback() {
  const playSelectedTrack = usePlaySelectedTrack();
  const { showToast } = useToast();

  return useCallback(
    async (trackId: string, trackName: string, artist: string, trackImage: string) => {
      try {
        await playSelectedTrack(trackId, trackName, artist, trackImage);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast(message, "error");
      }
    },
    [playSelectedTrack, showToast]
  );
}
