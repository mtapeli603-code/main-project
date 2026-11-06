"use client";

import { useState, type CSSProperties } from "react";
import styles from "./celebration-page.module.css";

type CelebrationPageProps = {
	onReplay: () => void;
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
const confirmationMessage =
	"Hey Dave 😂 I'm in for the Creamy Inn plan. I'll handle the bill as agreed. Let's pick a day! 😉";

const confetti = Array.from({ length: 30 }, (_, index) => ({
	left: `${(index * 37 + 7) % 100}%`,
	delay: `${(index % 10) * -0.37}s`,
	duration: `${5.6 + (index % 7) * 0.43}s`,
	color: ["var(--brand-lavender)", "var(--brand-gold)", "#a8b7a4", "var(--brand-rose)"][index % 4],
	rotation: `${(index * 47) % 160 - 80}deg`,
}));

function makeWhatsAppUrl() {
	if (!whatsappNumber) return null;
	return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(confirmationMessage)}`;
}

export default function CelebrationPage({ onReplay }: CelebrationPageProps) {
	const [whatsappMessage, setWhatsappMessage] = useState("");
	const whatsappUrl = makeWhatsAppUrl();

	function confirmDate() {
		if (!whatsappUrl) {
			setWhatsappMessage("Dave still needs to add his WhatsApp number before this can open.");
			return;
		}

		window.open(whatsappUrl, "_blank", "noopener,noreferrer");
		setWhatsappMessage("Your plan confirmation is ready in WhatsApp. ✅");
	}

	return (
		<section className={styles.celebration} aria-labelledby="celebration-title">
			<div className={styles.effects} aria-hidden="true">
				{confetti.map((piece, index) => (
					<span
						className={styles.confetti}
						key={index}
						style={{
							"--confetti-left": piece.left,
							"--confetti-delay": piece.delay,
							"--confetti-duration": piece.duration,
							"--confetti-color": piece.color,
							"--confetti-rotation": piece.rotation,
						} as CSSProperties}
					/>
				))}
				<span className={`${styles.playfulAccent} ${styles.accentOne}`}>😂</span>
				<span className={`${styles.playfulAccent} ${styles.accentTwo}`}>🍦</span>
				<span className={`${styles.sparkle} ${styles.sparkleOne}`}>✦</span>
				<span className={`${styles.sparkle} ${styles.sparkleTwo}`}>✧</span>
			</div>

			<div className={styles.card}>
				<p className={styles.eyebrow}><span aria-hidden="true" /> PLAN APPROVED</p>
				<h1 className={styles.title} id="celebration-title">IT&apos;S A PLAN, SHEKAINA! 😂</h1>
				<p className={styles.announcement}>CREAMY INN. GOOD VIBES. QUESTIONABLE FINANCIAL DECISIONS.</p>
				<div className={styles.divider} aria-hidden="true"><span>✦</span></div>
				<p className={styles.message}>
					Looking forward to hanging out, grabbing something sweet and having a good time. No pressure, just vibes. 😉
				</p>
				<p className={styles.signoff}>— Dave</p>

				<div className={styles.actions}>
					<button className={styles.whatsappButton} type="button" onClick={confirmDate}>
						<span aria-hidden="true">&#128140;</span> CONFIRM THE PLAN ON WHATSAPP
					</button>
					<p className={styles.whatsappStatus} role="status" aria-live="polite">{whatsappMessage}</p>
					<button className={styles.replayButton} type="button" onClick={onReplay}>
						<span aria-hidden="true">↺</span> Replay from the beginning
					</button>
				</div>
			</div>
		</section>
	);
}