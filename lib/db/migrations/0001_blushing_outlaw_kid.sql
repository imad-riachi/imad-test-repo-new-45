CREATE TABLE "cv_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_filename" text NOT NULL,
	"file_id" text NOT NULL,
	"user_id" integer,
	"file_type" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"content" json NOT NULL,
	"raw_content" text NOT NULL,
	CONSTRAINT "cv_data_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
ALTER TABLE "cv_data" ADD CONSTRAINT "cv_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;