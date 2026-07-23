CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text,
	`actor_id` text,
	`actor_type` text NOT NULL,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_org_time_idx` ON `audit_logs` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text NOT NULL,
	`lead_id` text NOT NULL,
	`channel` text NOT NULL,
	`ai_enabled` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`handoff_summary` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `conversations_scope_idx` ON `conversations` (`organization_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text NOT NULL,
	`lead_id` text,
	`plan` text,
	`subscription_status` text,
	`total_revenue` real DEFAULT 0 NOT NULL,
	`health_score` integer DEFAULT 0 NOT NULL,
	`health_factors_json` text DEFAULT '{}' NOT NULL,
	`csat` real,
	`nps` integer,
	`last_activity_at` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `customers_scope_idx` ON `customers` (`organization_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`normalized_phone` text,
	`external_user_id` text,
	`company` text,
	`stage` text DEFAULT 'New Lead' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`expected_value` real DEFAULT 0 NOT NULL,
	`source` text,
	`campaign` text,
	`assigned_to` text,
	`consent_status` text DEFAULT 'unknown' NOT NULL,
	`consent_at` text,
	`last_activity_at` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `leads_org_product_idx` ON `leads` (`organization_id`,`product_id`);--> statement-breakpoint
CREATE INDEX `leads_email_idx` ON `leads` (`organization_id`,`email`);--> statement-breakpoint
CREATE INDEX `leads_phone_idx` ON `leads` (`organization_id`,`normalized_phone`);--> statement-breakpoint
CREATE TABLE `lifecycle_events` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text NOT NULL,
	`lead_id` text,
	`visitor_id` text,
	`event_name` text NOT NULL,
	`occurred_at` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`properties_json` text DEFAULT '{}' NOT NULL,
	`attribution_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_idempotency_unique` ON `lifecycle_events` (`organization_id`,`idempotency_key`);--> statement-breakpoint
CREATE INDEX `events_product_time_idx` ON `lifecycle_events` (`organization_id`,`product_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`product_id` text NOT NULL,
	`conversation_id` text NOT NULL,
	`direction` text NOT NULL,
	`sender_type` text NOT NULL,
	`content` text NOT NULL,
	`sent_at` text NOT NULL,
	`agent_run_id` text,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `messages_conversation_idx` ON `messages` (`organization_id`,`product_id`,`conversation_id`,`sent_at`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`tracking_key` text NOT NULL,
	`website` text,
	`description` text DEFAULT '' NOT NULL,
	`brand_voice` text DEFAULT '' NOT NULL,
	`activation_event` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_tracking_key_unique` ON `products` (`tracking_key`);--> statement-breakpoint
CREATE INDEX `products_org_idx` ON `products` (`organization_id`);