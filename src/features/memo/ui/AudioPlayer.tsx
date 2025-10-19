interface AudioPlayerProps {
  displayAudioUrl: string | null;
  audioLoading: boolean;
};

export function AudioPlayer({ displayAudioUrl, audioLoading = true }: AudioPlayerProps) {
  return displayAudioUrl && (
    <div className="px-5">
      <audio src={displayAudioUrl} controls className="w-full" />
      {audioLoading && <div className="text-xs text-zinc-500 mt-1">Loading audio...</div>}
    </div>
  );
}
