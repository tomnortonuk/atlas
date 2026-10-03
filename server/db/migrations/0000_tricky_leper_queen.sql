CREATE TABLE `ae_performance` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`department_type` text,
	`total_attendances` integer,
	`attendances_4hr_breaches` integer,
	`attendances_12hr_trolley` integer,
	`ambulance_handover_30_to_60` integer,
	`ambulance_handover_over_60` integer
);
--> statement-breakpoint
CREATE TABLE `cancer_waiting` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`cancer_type` text,
	`two_week_wait_referrals` integer,
	`two_week_wait_seen` integer,
	`thirty_one_day_referrals` integer,
	`thirty_one_day_treated` integer,
	`sixty_two_day_referrals` integer,
	`sixty_two_day_treated` integer,
	`faster_diagnosis_28_day` integer
);
--> statement-breakpoint
CREATE TABLE `data_availability` (
	`availability_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` text NOT NULL,
	`reporting_period_start` text NOT NULL,
	`reporting_period_end` text NOT NULL,
	`publication_date` text,
	`loaded_date` text,
	`load_status` text DEFAULT 'pending',
	`record_count` integer,
	`error_message` text,
	FOREIGN KEY (`source_id`) REFERENCES `data_sources`(`source_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `data_sources` (
	`source_id` text PRIMARY KEY NOT NULL,
	`source_name` text NOT NULL,
	`source_description` text,
	`source_category` text,
	`publisher` text,
	`update_frequency` text,
	`typical_lag_days` integer,
	`endpoint_url` text,
	`api_credentials_required` integer DEFAULT false,
	`credentials_guide_url` text,
	`granularity` text,
	`active` integer DEFAULT true,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `diagnostic_waiting` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`diagnostic_test` text NOT NULL,
	`total_waiting` integer,
	`waiting_over_6_weeks` integer,
	`activity` integer
);
--> statement-breakpoint
CREATE TABLE `hcai_infections` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`infection_type` text NOT NULL,
	`cases` integer NOT NULL,
	`apportioned` integer,
	`third_party` integer
);
--> statement-breakpoint
CREATE TABLE `icb_hierarchy` (
	`hierarchy_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sicbl_code` text,
	`sicbl_name` text,
	`icb_code` text NOT NULL,
	`icb_name` text NOT NULL,
	`region_code` text NOT NULL,
	`region_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mental_health_activity` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`service_type` text,
	`referrals` integer,
	`open_referrals` integer,
	`discharges` integer,
	`contacts` integer,
	`caseload_count` integer
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`ods_code` text PRIMARY KEY NOT NULL,
	`organization_name` text NOT NULL,
	`organization_type` text NOT NULL,
	`sub_type` text,
	`status` text DEFAULT 'Active',
	`open_date` text,
	`close_date` text,
	`address_line1` text,
	`city` text,
	`postcode` text,
	`region_code` text,
	`region_name` text,
	`icb_code` text,
	`parent_ods_code` text,
	`latitude` real,
	`longitude` real,
	`last_updated` text
);
--> statement-breakpoint
CREATE TABLE `rtt_waiting_list` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`specialty_code` text NOT NULL,
	`specialty_name` text,
	`pathway_type` text,
	`weeks_waiting_band` text,
	`patient_count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shmi_mortality` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period_start` text NOT NULL,
	`reporting_period_end` text NOT NULL,
	`provider_ods_code` text NOT NULL,
	`diagnosis_group` text,
	`observed_deaths` integer,
	`expected_deaths` real,
	`shmi_ratio` real,
	`shmi_banding` text
);
--> statement-breakpoint
CREATE TABLE `user_saved_views` (
	`view_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`view_name` text NOT NULL,
	`view_description` text,
	`data_source_ids` text NOT NULL,
	`filters_json` text,
	`chart_config_json` text,
	`is_public` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text,
	`organization_ods` text,
	`role` text DEFAULT 'user',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`last_login` text
);
--> statement-breakpoint
CREATE TABLE `workforce_monthly` (
	`record_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporting_period` text NOT NULL,
	`org_ods_code` text NOT NULL,
	`staff_group` text NOT NULL,
	`occupation_code` text,
	`headcount` integer,
	`fte` real,
	`vacancies_fte` real,
	`sickness_absence_rate` real,
	`turnover_rate` real,
	`bank_staff_fte` real,
	`agency_staff_fte` real
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);