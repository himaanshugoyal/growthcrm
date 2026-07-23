PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_marketing_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`team_size` text NOT NULL,
	`goal` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_marketing_leads`("id", "name", "email", "phone", "team_size", "goal", "message", "source", "consent_at", "created_at") SELECT "id", "name", "email", "phone", "team_size", "goal", "message", CASE WHEN "source" = 'website_demo' THEN 'website' ELSE "source" END, "consent_at", "created_at" FROM `marketing_leads`;--> statement-breakpoint
DROP TABLE `marketing_leads`;--> statement-breakpoint
ALTER TABLE `__new_marketing_leads` RENAME TO `marketing_leads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `marketing_leads_created_idx` ON `marketing_leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `marketing_leads_email_idx` ON `marketing_leads` (`email`);
