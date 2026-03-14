/**
 * @fileoverview Main orchestrator for the laboratory calculators.
 * Manages the high-level state of the calculation environment and coordinates
 * the dynamic switching between specialized training protocols.
 * @module features/calculators/components/CalculatorsClientView
 */

"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radical } from "lucide-react";
import { CALCULATOR_OPTIONS, CalculatorType } from "../types";
import { OneRepMaxCalculator } from "./OneRepMaxCalculator";
import { WilksCalculator } from "./WilksCalculator";
import { RpeCalculator } from "./RpeCalculator";
import { BmiCalculator } from "./BmiCalculator";

/**
 * CalculatorsClientView Component.
 * * @description
 * Acts as the "Control Hub" for training metrics. It provides a primary selection
 * interface (Protocol Selector) and dynamically renders the corresponding
 * calculation engine (1RM, Wilks, BMI or RPE).
 * * Logic flow:
 * 1. Tracks the `activeCalculator` state.
 * 2. Matches the state with `CALCULATOR_OPTIONS` to retrieve technical descriptions.
 * 3. Switches the rendered UI layer using a specialized `renderCalculator` pattern.
 * * @returns {JSX.Element} The orchestrated calculation workspace.
 */
export const CalculatorsClientView = () => {
	/** @type {[CalculatorType, function]} Internal state for the active laboratory protocol. */
	const [activeCalculator, setActiveCalculator] = useState<CalculatorType>("1rm");

	/** @constant activeOption - Metadata retrieval for the currently selected tool. */
	const activeOption = CALCULATOR_OPTIONS.find((opt) => opt.value === activeCalculator);

	/**
	 * Engine Switcher.
	 * Maps the active state to the specific React component responsible
	 * for that protocol's mathematics and UI.
	 * @returns {JSX.Element | null} The active calculator component.
	 */
	const renderCalculator = () => {
		switch (activeCalculator) {
			case "1rm":
				return <OneRepMaxCalculator description={activeOption?.description} />;
			case "wilks":
				return <WilksCalculator description={activeOption?.description} />;
			case "rpe":
				return <RpeCalculator description={activeOption?.description} />;
			case "bmi":
				return <BmiCalculator description={activeOption?.description} />;

			default:
				return null;
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6 mt-6">
			{/* PROTOCOL SELECTOR: The primary entry point for tool selection */}
			<div className="flex flex-col space-y-2">
				<label className="text-[10px] uppercase font-black tracking-[0.2em] text-primary ml-1">Select Laboratory Protocol</label>
				<Select value={activeCalculator} onValueChange={(value) => setActiveCalculator(value as CalculatorType)}>
					<SelectTrigger className="w-full bg-secondary/20 border-primary/20 h-12 text-md font-bold italic uppercase tracking-tighter">
						<div className="flex items-center gap-2">
							<Radical size={18} className="text-primary" />
							<SelectValue placeholder="Choose Calculator" />
						</div>
					</SelectTrigger>
					<SelectContent className="bg-popover border-primary/20">
						{CALCULATOR_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value} className="focus:bg-primary/10 uppercase font-bold italic text-xs tracking-tight py-3">
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* DYNAMIC CALCULATOR RENDER*/}
			<div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">{renderCalculator()}</div>
		</div>
	);
};
