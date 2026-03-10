/**
 * @fileoverview Headless core for training analytics and strength calibration.
 * Centralizes high-precision formulas for performance metrics within the VOLT.LAB ecosystem.
 * @module hooks/useCalculators
 */

"use client";

import { useState, useMemo } from "react";

/** * @typedef {("male" | "female")} Gender
 * Biological gender classification for coefficient selection.
 */
type Gender = "male" | "female";

/** * @typedef {("total" | "bench" | "squat" | "deadlift")} LiftType
 * Measurement protocols for Wilks Score classification.
 */
export type LiftType = "total" | "bench" | "squat" | "deadlift";

/**
 * useCalculators Hook.
 * @description
 * A specialized headless hook that provides reactive states and memoized
 * calculations for 1RM, Wilks Score, and RPE-based intensity mapping.
 * * @features
 * 1. **Brzycki Protocol**: Validates 1RM for low-repetition strength testing.
 * 2. **IPF Wilks Standard**: Implements 5th-degree polynomial coefficients for relative strength.
 * 3. **RPE e1RM Engine**: Maps perceived exertion to estimated maximum capacity.
 * * @returns {Object}
 * - `oneRepMax`: Object containing inputs, setters, result, and intensity lookup table.
 * - `wilks`: Object containing inputs, gender-specific setters, and the calculated score.
 * - `rpe`: Object containing RPE inputs and the estimated 1RM result.
 */
export const useCalculators = () => {
	// --- 1RM States ---
	/** @type {number} Base load used for 1RM and RPE calculations. */
	const [weight, setWeight] = useState<number>(0);
	/** @type {number} Repetitions performed in the calibration set. */
	const [reps, setReps] = useState<number>(0);

	// --- Wilks States ---
	/** @type {number} Athlete's current body mass for relative strength scaling. */
	const [bodyWeight, setBodyWeight] = useState<number>(0);
	/** @type {number} Sum of lifts or individual lift weight for Wilks scoring. */
	const [totalLifted, setTotalLifted] = useState<number>(0);
	/** @type {Gender} Gender class for Wilks coefficient selection. */
	const [gender, setGender] = useState<Gender>("male");
	/** @type {LiftType} Categorization of the lift for standard referencing. */
	const [liftType, setLiftType] = useState<LiftType>("total");

	// --- RPE States ---
	/** @type {number} Rate of Perceived Exertion (scale 6.0 - 10.0). */
	const [rpe, setRpe] = useState<number>(8);

	/**
	 * Estimated 1RM (Brzycki Formula).
	 * @formula w / (1.0278 - (0.0278 * r))
	 * @description Considered the industry standard for high-accuracy estimation
	 * when repetitions are below 10.
	 */
	const brzycki1RM = useMemo(() => {
		if (!weight || !reps) return 0;
		if (reps === 1) return weight;
		const result = weight / (1.0278 - 0.0278 * reps);
		return Math.round(result * 10) / 10;
	}, [weight, reps]);

	/**
	 * Intensity Mapping Table.
	 * @description Generates a relational map between percentage of 1RM
	 * and estimated repetition capacity for training programming.
	 */
	const intensityTable = useMemo(() => {
		const protocols = [
			{ pct: 95, reps: 2 },
			{ pct: 90, reps: 4 },
			{ pct: 85, reps: 6 },
			{ pct: 80, reps: 8 },
			{ pct: 75, reps: 10 },
			{ pct: 70, reps: 12 },
		];

		return protocols.map((item) => ({
			percentage: item.pct,
			reps: item.reps,
			weight: Math.round(brzycki1RM * (item.pct / 100) * 10) / 10,
		}));
	}, [brzycki1RM]);

	/**
	 * Wilks Score Coefficient Logic.
	 * @description Calculates points using the standard IPF polynomial:
	 * score = weight * (500 / (a + bx + cx^2 + dx^3 + ex^4 + fx^5))
	 */
	const wilksScore = useMemo(() => {
		if (!bodyWeight || !totalLifted) return 0;

		const coeff = {
			male: { a: -216.0475144, b: 16.2606339, c: -0.002388645, d: -0.00113732, e: 7.01863e-6, f: -1.291e-8 },
			female: { a: 594.31747775, b: -27.23842536, c: 0.8211222687, d: -0.0093073391, e: 4.731582e-5, f: -9.054e-8 },
		};

		const c = gender === "male" ? coeff.male : coeff.female;
		const x = bodyWeight;

		const denominator = c.a + c.b * x + c.c * Math.pow(x, 2) + c.d * Math.pow(x, 3) + c.e * Math.pow(x, 4) + c.f * Math.pow(x, 5);
		const score = totalLifted * (500 / denominator);
		return Math.round(score * 100) / 100;
	}, [bodyWeight, totalLifted, gender]);

	/**
	 * RPE to Estimated 1RM Mapping.
	 * @description Maps subjective exertion (RPE) to a theoretical maximum.
	 * @logic Uses a linear decay model where each RPE point/Rep approx. 2.85% intensity.
	 */
	const rpeToPercent = useMemo(() => {
		if (!weight || !reps || !rpe) return 0;

		const rpeDiff = 10 - rpe;
		const totalRepsEffort = reps + rpeDiff;

		const estimatedPct = 100 - (totalRepsEffort - 1) * 2.85;

		const e1RM = weight / (estimatedPct / 100);
		return Math.round(e1RM * 10) / 10;
	}, [weight, reps, rpe]);

	return {
		// 1RM Data & Actions
		oneRepMax: {
			inputs: { weight, reps },
			actions: { setWeight, setReps },
			result: brzycki1RM,
			intensityTable,
		},
		// Wilks Data & Actions
		wilks: {
			inputs: { bodyWeight, totalLifted, gender, liftType },
			actions: { setBodyWeight, setTotalLifted, setGender, setLiftType },
			result: wilksScore,
		},
		// RPE Data & Actions
		rpe: {
			inputs: { weight, reps, rpe },
			actions: { setWeight, setReps, setRpe },
			result: rpeToPercent,
		},
	};
};
