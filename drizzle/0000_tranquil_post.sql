CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`tree_id` text NOT NULL,
	`name` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`tree_id`) REFERENCES `trees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trees` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`intro` text NOT NULL,
	`questions` text NOT NULL,
	`created` integer NOT NULL
);
