CREATE TABLE "job_descriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"cv_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
);
--> statement-breakpoint
CREATE TABLE "rewritten_cvs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"cv_id" integer NOT NULL,
	"job_description_id" integer NOT NULL,
	"content" text NOT NULL,
	"json_content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_cv_id_cv_data_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv_data"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewritten_cvs" ADD CONSTRAINT "rewritten_cvs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewritten_cvs" ADD CONSTRAINT "rewritten_cvs_cv_id_cv_data_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv_data"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewritten_cvs" ADD CONSTRAINT "rewritten_cvs_job_description_id_job_descriptions_id_fk" FOREIGN KEY ("job_description_id") REFERENCES "public"."job_descriptions"("id") ON DELETE no action ON UPDATE no action;
