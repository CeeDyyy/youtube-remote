import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function YouTubePlayer({ video, isPause, seeker }) {
  const playerRef = useRef(null);

  const onPlayerReady = (event) => {
    // Save the player instance
    playerRef.current = event.target;
  };

  const YOUTUBE_VIDEO_ID = video.vid; // Change to any video you like

  const handlePlay = () => {
    playerRef.current?.playVideo();
  };
  const handlePause = () => {
    playerRef.current?.pauseVideo();
  };
  useEffect(() => {
    if (isPause) handlePause();
    else handlePlay();
  }, [isPause])

  const seek = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
    }
  };
  useEffect(() => {
    seek(Number(seeker.split('-')[0]))
  }, [seeker])

  return (
    <div>
      <YouTube
        videoId={YOUTUBE_VIDEO_ID}
        onReady={onPlayerReady}
        opts={{
          width: '384', //480 for full with rounded
          height: '216',  // 270 for full with rounded
          playerVars: {
            start: video.t,
            mute: 1,
            autoplay: 1,
            controls: 0, // This is the key parameter to hide controls
            // You can also add other parameters here, such as:
            // modestbranding: 1, // Hides the YouTube logo
            // rel: 0, // Shows only related videos from the same channel
            // disablekb: 1, // Disables keyboard controls
          },
        }}
      />
    </div>
  );
}