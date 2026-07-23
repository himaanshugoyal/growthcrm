CREATE TABLE `automations` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text,
	`name` text NOT NULL,
	`trigger_description` text NOT NULL,
	`action_description` text NOT NULL,
	`run_count` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `automations_org_idx` ON `automations` (`organization_id`);--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`platform` text NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`spend` real DEFAULT 0 NOT NULL,
	`lead_count` integer DEFAULT 0 NOT NULL,
	`paid_count` integer DEFAULT 0 NOT NULL,
	`revenue` real DEFAULT 0 NOT NULL,
	`last_synced_at` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `campaigns_scope_idx` ON `campaigns` (`organization_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text,
	`provider` text NOT NULL,
	`status` text DEFAULT 'Disconnected' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`last_synced_at` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `integrations_org_idx` ON `integrations` (`organization_id`);--> statement-breakpoint
CREATE TABLE `lead_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`lead_id` text NOT NULL,
	`author_name` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `lead_notes_lead_time_idx` ON `lead_notes` (`lead_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text,
	`lead_id` text,
	`title` text NOT NULL,
	`task_type` text DEFAULT 'Follow-up' NOT NULL,
	`due_at` text,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`assigned_to` text,
	`completed_at` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `tasks_org_due_idx` ON `tasks` (`organization_id`,`due_at`);--> statement-breakpoint
ALTER TABLE `leads` ADD `location` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `requirement` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `pain` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `budget` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `timeline` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `next_step` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `intent` text;