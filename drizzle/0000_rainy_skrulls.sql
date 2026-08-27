CREATE TABLE `recovery_decisions` (
	`decision_id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`amount` integer NOT NULL,
	`action` text NOT NULL,
	`confidence_basis_points` integer NOT NULL,
	`execution_mode` text NOT NULL,
	`scheduled_for` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_recovery_decisions_idempotency` ON `recovery_decisions` (`event_id`,`action`);--> statement-breakpoint
CREATE INDEX `idx_recovery_decisions_created` ON `recovery_decisions` (`created_at`);--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`payment_id` text,
	`payload_hash` text NOT NULL,
	`received_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_webhook_events_type_received` ON `webhook_events` (`event_type`,`received_at`);