"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import InvitationStages, { type InvitationPage } from "./invitation-stages";
import SpotifyPlayer from "./spotify-player";
import styles from "./opening-experience.module.css";

const decorations = [
	{ mark: "✧", top: "13%", left: "8%", delay: "0s", size: "21px" },
	{ mark: "✦", top: "21%", left: "91%", delay: "1.2s", size: "15px" },
	{ mark: "✧", top: "72%", left: "5%", delay: "2s", size: "15px" },
	{ mark: "✦", top: "82%", left: "87%", delay: "0.6s", size: "18px" },
	{ mark: "✧", top: "45%", left: "96%", delay: "2.8s", size: "12px" },
];

export default function OpeningExperience() {
	const hasOpenedRef = useRef(false);
	const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [envelopeOpen, setEnvelopeOpen] = useState(false);
	const [noteRevealed, setNoteRevealed] = useState(false);
	const [experiencePage, setExperiencePage] = useState<"opening" | InvitationPage>("opening");

	useEffect(() => {
		return () => {
			if (revealTimer.current) clearTimeout(revealTimer.current);
		};
	}, []);

	function openSurprise() {
		if (hasOpenedRef.current) return;
		hasOpenedRef.current = true;
		setEnvelopeOpen(true);
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		revealTimer.current = setTimeout(() => setNoteRevealed(true), reducedMotion ? 0 : 620);
	}

	function replayExperience() {
		if (revealTimer.current) clearTimeout(revealTimer.current);
		hasOpenedRef.current = false;
		setEnvelopeOpen(false);
		setNoteRevealed(false);
		setExperiencePage("opening");
	}

	return (
		<main className={styles.experience}>
			<div className={styles.ambient} aria-hidden="true">
				{decorations.map((decoration, index) => (
					<span
						className={styles.ambientMark}
						key={`${decoration.mark}-${index}`}
						style={
							{
								top: decoration.top,
								left: decoration.left,
								animationDelay: decoration.delay,
								fontSize: decoration.size,
							} as CSSProperties
						}
					>
						{decoration.mark}
					</span>
				))}
			</div>

			<div className={styles.frame}>
				<header className={styles.topbar}>
					<p className={styles.wordmark}>
						A DATE WITH DAVE <span aria-hidden="true">✦</span>
					</p>
					<SpotifyPlayer />
				</header>

				{experiencePage === "opening" ? (
				<section className={styles.hero} aria-labelledby="welcome-title">
					<div className={styles.copy}>
						<p className={styles.eyebrow}>
							<span aria-hidden="true" className={styles.eyebrowLine} />
							A LOW-KEY PLAN
						</p>
						<h1 className={styles.title} id="welcome-title">
							HEY SHEKAINA! <span className={styles.titleAccent}>👀</span>
						</h1>
						<p className={styles.supporting}>
							So... Dave has a little plan. Don&apos;t overthink it. Just open the surprise. 😂
						</p>
						<div className={styles.actionGroup}>
							<button
								className={styles.openButton}
								type="button"
								onClick={noteRevealed ? () => setExperiencePage("invitation") : openSurprise}
								disabled={envelopeOpen && !noteRevealed}
								aria-expanded={envelopeOpen}
								aria-controls="dave-love-note"
							>
								<span>{!envelopeOpen ? "OPEN THE SURPRISE" : noteRevealed ? "LET ME ASK YOU..." : "OPENING THE NOTE..."}</span>
								<span className={styles.buttonIcon} aria-hidden="true">&#128140;</span>
							</button>
							<p className={styles.actionCaption} aria-live="polite">
								{envelopeOpen ? "Your note is open. Your move. 😏" : "Go on. Curiosity won't hurt. 😂"}
							</p>
						</div>
					</div>

					<div className={styles.letterStage}>
						<div className={styles.halo} aria-hidden="true" />
						<div
							className={styles.envelopeScene}
							data-open={envelopeOpen}
							role="group"
							aria-label="A pastel pink envelope with a lavender seal"
						>
							<article
								className={styles.letter}
								id="dave-love-note"
								aria-live="polite"
								aria-hidden={!noteRevealed}
							>
								<p className={styles.letterSalutation}>Shekaina,</p>
								<p className={styles.letterMessage}>
									This is a low-pressure plan from Dave. Open up and see if you&apos;re in. 😉
								</p>
								<p className={styles.letterSignoff}>— Dave</p>
							</article>
							<div className={styles.envelopeBack} aria-hidden="true" />
							<div className={styles.envelopeFlap} aria-hidden="true" />
							<div className={styles.envelopeFront} aria-hidden="true" />
							<div className={styles.seal} aria-hidden="true">
								<span>✦</span>
							</div>
						</div>
						<p className={styles.envelopeCaption} aria-hidden="true">
							{noteRevealed ? "A note from Dave" : "A note with a plot twist"}
						</p>
					</div>
				</section>
				) : (
					<InvitationStages
						key={experiencePage}
						page={experiencePage}
						onInvitationYes={() => setExperiencePage("destination")}
						onDestinationYes={() => setExperiencePage("billReveal")}
						onBillYes={() => setExperiencePage("celebration")}
						onReplay={replayExperience}
					/>
				)}

				<footer className={styles.footer}>
					<span aria-hidden="true">&#10022;</span> A questionable plan by Dave <span aria-hidden="true">&#10022;</span>
				</footer>
			</div>
		</main>
	);
}