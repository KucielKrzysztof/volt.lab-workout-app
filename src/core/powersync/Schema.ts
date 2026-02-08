import { Schema, Table, Column, ColumnType } from "@powersync/web";

export const WORKOUT_SCHEMA = new Schema([
	new Table({
		name: "workout_plans",
		columns: [
			new Column({ name: "user_id", type: ColumnType.TEXT }),
			new Column({ name: "name", type: ColumnType.TEXT }),
			new Column({ name: "created_at", type: ColumnType.TEXT }),
		],
	}),
	new Table({
		name: "exercises",
		columns: [
			new Column({ name: "plan_id", type: ColumnType.TEXT }),
			new Column({ name: "name", type: ColumnType.TEXT }),
			new Column({ name: "order_index", type: ColumnType.INTEGER }),
		],
	}),
	new Table({
		name: "workout_sessions",
		columns: [
			new Column({ name: "user_id", type: ColumnType.TEXT }),
			new Column({ name: "plan_id", type: ColumnType.TEXT }),
			new Column({ name: "completed_at", type: ColumnType.TEXT }),
		],
	}),
	new Table({
		name: "set_logs",
		columns: [
			new Column({ name: "session_id", type: ColumnType.TEXT }),
			new Column({ name: "exercise_id", type: ColumnType.TEXT }),
			new Column({ name: "weight", type: ColumnType.REAL }), // real dla liczb zmiennoprzecinkowych (kg)
			new Column({ name: "reps", type: ColumnType.INTEGER }),
			new Column({ name: "set_number", type: ColumnType.INTEGER }),
		],
	}),
]);

export type DatabaseNavbar = typeof WORKOUT_SCHEMA;
