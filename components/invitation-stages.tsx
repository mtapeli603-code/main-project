"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import CelebrationPage from "./celebration-page";
import styles from "./invitation-stages.module.css";

export type InvitationPage = "invitation" | "destination" | "billReveal" | "celebration";

type InvitationStagesProps = {
	page: InvitationPage;
	onInvitationYes: () => void;
	onDestinationYes: () => void;
	onBillYes: () => void;
	onReplay: () => void;
};

const playfulMessages = [
	"Oopsie! 😂",
	"Nice try, Shekaina! 😂",
	"Too slow!",
	"That button has places to be!",
	"Try the YES lane 😏",
	"You're making this difficult 😉",
];

const sweetThings = [
	{ symbol: "🍦", label: "Ice cream" },
	{ symbol: "🥤", label: "Milkshakes" },
	{ symbol: "🧇", label: "Waffles" },
	{ symbol: "🍰", label: "Sweet treats" },
];

export default function InvitationStages({ page, onInvitationYes, onDestinationYes, onBillYes, onReplay }: InvitationStagesProps) {
	const isDestination = page === "destination";
	const isBillReveal = page === "billReveal";
	const [billRevealed, setBillRevealed] = useState(false);

	useEffect(() => {
		if (!isBillReveal) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const timer = setTimeout(() => setBillRevealed(true), reducedMotion ? 0 : 1900);
		return () => clearTimeout(timer);
	}, [isBillReveal]);

	if (page === "celebration") {
		return <CelebrationPage onReplay={onReplay} />;
	}

	if (isBillReveal) {
		return (
			<section className={`${styles.page} ${styles.billPage}`} aria-labelledby="stage-title">
				<div className={styles.billContent}>
					<p className={styles.eyebrow}><span aria-hidden="true" /> THE SMALL PRINT</p>
					<h1 className={styles.title} id="stage-title">WAIT A MINUTE, SHEKAINA! 👀</h1>

					<div className={styles.revealArea} aria-live="polite" aria-busy={!billRevealed}>
						{billRevealed ? (
							<div className={styles.billReveal}>
								<span className={styles.receiptMark} aria-hidden="true">&#36;</span>
								<p className={styles.billAnnouncement}>YOU&apos;RE PAYING THE BILL! 😂💳</p>
								<span className={styles.receiptMark} aria-hidden="true">&#36;</span>
							</div>
						) : (
							<div className={styles.suspense} role="status">
								<span className={styles.suspenseSeal} aria-hidden="true">?</span>
								<p>There&apos;s one financial detail to discuss...</p>
								<div className={styles.suspenseDots} aria-hidden="true"><i /><i /><i /></div>
							</div>
						)}
					</div>

					{billRevealed && (
						<div className={styles.billDetails}>
							<p className={styles.billMessage}>
								I&apos;ll bring the jokes, good company and conversation. You handle the financial department. Seems like a fair arrangement, right? 😂
							</p>
							<div className={styles.questionSurface}>
								<p className={styles.question}>Are you sponsoring our Creamy Inn mission?</p>
								<AnswerChoices
									yesLabel="YES, MY TREAT! 💅"
									noLabel="NO WAY! 😭"
									onYes={onBillYes}
									yesAccepted={false}
								/>
							</div>
						</div>
					)}
				</div>
			</section>
		);
	}

	return (
		<section className={styles.page} aria-labelledby="stage-title">
			<div className={styles.content}>
				<p className={styles.eyebrow}>
					<span aria-hidden="true" />
					{isDestination ? "THE DESTINATION" : "QUICK QUESTION"}
				</p>
				<h1 className={styles.title} id="stage-title">
					{isDestination ? "HOW ABOUT CREAMY INN?" : "A LITTLE OUTING?"}
					<span className={styles.titleHeart} aria-hidden="true">{isDestination ? "🍦" : "😏"}</span>
				</h1>
				<p className={styles.introduction}>
					{isDestination
						? "Something sweet, a few laughs and some quality time. Sounds like a decent plan, right?"
						: "Good company, good food and absolutely no unnecessary drama. 😉"}
				</p>

				{isDestination && (
					<div className={styles.sweets} aria-label="Creamy Inn treats">
						{sweetThings.map((item) => (
							<div className={styles.sweet} key={item.label}>
								<span className={styles.sweetArt} aria-hidden="true">{item.symbol}</span>
								<span className={styles.sweetLabel}>{item.label}</span>
							</div>
						))}
					</div>
				)}

				<div className={styles.questionSurface}>
					<p className={styles.question}>
						{isDestination ? "Shall we make Creamy Inn our destination?" : "Would you be down for a little outing with me?"}
					</p>
					<AnswerChoices
							yesLabel={isDestination
								? "YES, LET'S GO! 🍦"
							: "YEAH, I'M IN 😏"}
						noLabel={isDestination ? "NO WAY! 🙈" : "NOT INTERESTED 😂"}
							onYes={isDestination ? onDestinationYes : onInvitationYes}
							yesAccepted={false}
					/>
				</div>
			</div>
		</section>
	);
}

type AnswerChoicesProps = {
	yesLabel: string;
	noLabel: string;
	onYes: () => void;
	yesAccepted: boolean;
};

function AnswerChoices({ yesLabel, noLabel, onYes, yesAccepted }: AnswerChoicesProps) {
	const laneRef = useRef<HTMLDivElement>(null);
	const noButtonRef = useRef<HTMLButtonElement>(null);
	const messageIndex = useRef(-1);
	const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		function keepNoButtonInLane() {
			const lane = laneRef.current;
			const button = noButtonRef.current;
			if (!lane || !button) return;

			const maxLeft = Math.max(0, lane.clientWidth - button.offsetWidth);
			const maxTop = Math.max(0, lane.clientHeight - button.offsetHeight);
			setPosition((current) => current && {
				left: Math.min(current.left, maxLeft),
				top: Math.min(current.top, maxTop),
			});
		}

		window.addEventListener("resize", keepNoButtonInLane);
		return () => window.removeEventListener("resize", keepNoButtonInLane);
	}, []);

	function dodgeNoButton(pointerX?: number, pointerY?: number) {
		const lane = laneRef.current;
		const button = noButtonRef.current;
		if (!lane || !button) return;

		const laneRect = lane.getBoundingClientRect();
		const maxLeft = Math.max(0, lane.clientWidth - button.offsetWidth);
		const maxTop = Math.max(0, lane.clientHeight - button.offsetHeight);
		const current = position ?? { left: maxLeft / 2, top: maxTop / 2 };
		let next = current;

		for (let attempt = 0; attempt < 10; attempt += 1) {
			const candidate = {
				left: Math.random() * maxLeft,
				top: Math.random() * maxTop,
			};
			const movedEnough = Math.hypot(candidate.left - current.left, candidate.top - current.top) > 24;
			const avoidsPointer =
				pointerX === undefined ||
				pointerY === undefined ||
				pointerX < laneRect.left + candidate.left - 10 ||
				pointerX > laneRect.left + candidate.left + button.offsetWidth + 10 ||
				pointerY < laneRect.top + candidate.top - 10 ||
				pointerY > laneRect.top + candidate.top + button.offsetHeight + 10;

			if (movedEnough && avoidsPointer) {
				next = candidate;
				break;
			}
			next = candidate;
		}

		setPosition(next);
		messageIndex.current = (messageIndex.current + 1) % playfulMessages.length;
		setMessage(playfulMessages[messageIndex.current]);
	}

	function handlePointerEnter(event: PointerEvent<HTMLButtonElement>) {
		if (event.pointerType === "mouse") dodgeNoButton(event.clientX, event.clientY);
	}

	function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
		event.preventDefault();
		dodgeNoButton(event.clientX, event.clientY);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			dodgeNoButton();
		}
	}

	return (
		<div className={styles.answerArea}>
			<div className={styles.choices}>
				<button
					className={styles.yesButton}
					type="button"
					onClick={onYes}
					aria-pressed={yesAccepted}
				>
					{yesLabel}
				</button>
				<div className={styles.noLane} ref={laneRef}>
					<button
						className={styles.noButton}
						ref={noButtonRef}
						type="button"
						onPointerEnter={handlePointerEnter}
						onPointerDown={handlePointerDown}
						onKeyDown={handleKeyDown}
						aria-label={`${noLabel} This button playfully dodges; use the YES option to answer.`}
						aria-describedby="no-button-message"
						style={position ? { ...position, transform: "none" } : undefined}
					>
						{noLabel}
					</button>
				</div>
			</div>
			<p className={styles.noMessage} id="no-button-message" role="status" aria-live="polite">
				{message}
			</p>
		</div>
	);
}