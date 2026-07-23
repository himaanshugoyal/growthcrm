CREATE TABLE `marketing_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`team_size` text NOT NULL,
	`goal` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'website_demo' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `marketing_leads_created_idx` ON `marketing_leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `marketing_leads_email_idx` ON `marketing_leads` (`email`);