/**
 * @fileoverview Core type definitions and configuration for laboratory calculators.
 * Defines the available protocols for training intensity and strength calibration.
 * @module features/calculators/types
 */

/**
 * @typedef {("1rm" | "wilks" | "plates" | "rpe")} CalculatorType
 * @description
 * Available calculation engines within the VOLT.LAB ecosystem:
 * - `1rm`: Estimated One Rep Max using Brzycki's formula.
 * - `wilks`: Relative strength coefficient for powerlifting comparison.
 * - `plates`: Visual plate loading distribution (Pending Calibration).
 * - `rpe`: Intensity mapping based on Rate of Perceived Exertion.
 */
export type CalculatorType = "1rm" | "wilks" | "plates" | "rpe";

/**
 * @interface CalculatorOption
 * @description Represents a selectable laboratory protocol in the UI.
 * @property {CalculatorType} value - The unique identifier/key for the calculator engine.
 * @property {string} label - Human-readable name displayed in the selection interface.
 * @property {string} description - Technical summary of the formula or purpose of the tool.
 */
export interface CalculatorOption {
	value: CalculatorType;
	label: string;
	description: string;
}

/**
 * @constant CALCULATOR_OPTIONS
 * @type {CalculatorOption[]}
 * @description
 * The official registry of active laboratory tools.
 * This array drives the main 'Select Laboratory Protocol' interface.
 */
export const CALCULATOR_OPTIONS: CalculatorOption[] = [
	{
		value: "1rm",
		label: "One Rep Max",
		description: "Estimate your maximum strength using Brzycki formula.",
	},
	{
		value: "wilks",
		label: "Wilks Score",
		description: "Calculate relative strength across different body weights.",
	},
	{
		value: "rpe",
		label: "RPE / Reps Target",
		description: "Calculate intensity based on perceived exertion.",
	},
	/** * @todo Implement Plate Loader visual logic
	 * { value: "plates", label: "Plate Loader", description: "Optimal plate distribution for a specific weight." }
	 */
];
