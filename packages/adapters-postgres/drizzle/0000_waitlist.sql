CREATE SCHEMA "main";
--> statement-breakpoint
CREATE TABLE "main"."waitlist" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "main"."waitlist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"design_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_key" UNIQUE("email"),
	CONSTRAINT "waitlist_email_check" CHECK ("main"."waitlist"."email" = lower(btrim("main"."waitlist"."email")) and length("main"."waitlist"."email") between 3 and 254)
);
