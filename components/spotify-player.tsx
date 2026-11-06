import styles from "./spotify-player.module.css";

const spotifyTrackUrl = "https://open.spotify.com/track/4nFrcGM7MY1mpoQCC7Kefj";
const spotifyEmbedUrl = "https://open.spotify.com/embed/track/4nFrcGM7MY1mpoQCC7Kefj";

export default function SpotifyPlayer() {
	return (
		<aside className={styles.player} aria-label="Music selection">
			<iframe
				className={styles.embed}
				title="Spotify player for Me & U by Tems"
				src={spotifyEmbedUrl}
				width="280"
				height="152"
				allow="encrypted-media; clipboard-write; fullscreen; picture-in-picture"
				loading="lazy"
				referrerPolicy="strict-origin-when-cross-origin"
			/>
			<a className={styles.fallback} href={spotifyTrackUrl} target="_blank" rel="noreferrer">
				If the player doesn&apos;t load, open the official track <span aria-hidden="true">↗</span>
			</a>
		</aside>
	);
}