use std::sync::Arc;

// Password Helper
use argon2::{
	password_hash::SaltString,
	Argon2,
	PasswordHash,
	PasswordHasher,
	PasswordVerifier,
};
use rand_core::OsRng;

use axum::{
	http::StatusCode,
	extract::{ Extension, Path },
	response::{ IntoResponse },
	Json,
};
use diesel::prelude::*;
use diesel::insert_into;
use serde_json::{ json, Value };
use chrono::Utc;

use crate::{ handle_error, kbve_get_conn, simple_error };
use crate::harden::{ sanitize_email, sanitize_username, validate_password };
use crate::db::{ Pool };
use crate::models::{ User, Profile };
use crate::wh::{ error_casting, error_simple, WizardResponse, RegisterUserSchema };
use crate::schema::{ auth, profile, users };

//	Hazardous Functions

//	TODO: Create Profile from UUID

pub async fn hazardous_create_profile_from_uuid(
	clean_name: String,
	clean_uuid: u64, 
	pool: Arc<Pool>
) -> Result<bool, &'static str> {
	let mut conn = kbve_get_conn!(pool);

	match
		insert_into(profile::table)
			.values((
				profile::name.eq(clean_name),
				profile::bio.eq(clean_name),
				profile::unsplash.eq(0),
				profile::github.eq(0),
				profile::instagram.eq(0)
			))
			.execute(&mut conn)
	{
		Ok(_) => Ok(true),
		Err(_) => Err("Failed to insert profile into database"),
	}
}

pub async fn hazardous_create_user(
	clean_username: String,
	pool: Arc<Pool>
) -> Result<bool, &'static str> {
	let mut conn = kbve_get_conn!(pool);

	match
		insert_into(users::table)
			.values((
				users::username.eq(clean_username),
				users::role.eq(0), // Setting role to 0
				users::reputation.eq(0), // Setting reputation to 0
				users::exp.eq(0), // Setting exp to 0
				users::created_at.eq(Utc::now().naive_utc()), // Setting current UTC time
			))
			.execute(&mut conn)
	{
		Ok(_) => Ok(true),
		Err(_) => Err("Failed to insert user into database"),
	}
}

pub async fn hazardous_boolean_email_exist(
	clean_email: String,
	pool: Arc<Pool>
) -> Result<bool, &'static str> {
	let mut conn = kbve_get_conn!(pool);

	match
		auth::table
			.filter(auth::email.eq(clean_email))
			.select(auth::uuid)
			.first::<u64>(&mut conn)
	{
		Ok(_) => Ok(true),
		Err(diesel::NotFound) => Ok(false),
		Err(_) => Err("Database error"),
	}
}

pub async fn hazardous_boolean_username_exist(
	clean_username: String,
	pool: Arc<Pool>
) -> Result<bool, &'static str> {
	let mut conn = kbve_get_conn!(pool);

	match
		users::table
			.filter(users::username.eq(clean_username))
			.select(users::id)
			.first::<u64>(&mut conn)
	{
		Ok(_) => Ok(true),
		Err(diesel::NotFound) => Ok(false),
		Err(_) => Err("Database error"),
	}
}



//	Task Fetch

pub async fn task_fetch_userid_by_username(
	username: String,
	pool: Arc<Pool>
)
-> Result<u64, &'static str> {
	let mut conn = kbve_get_conn!(pool);

	let clean_username = simple_error!(sanitize_username(&username), "invalid_username");

	match
		users::table
			.filter(users::username.eq(clean_username))
			.select(users::id)
			.first::<u64>(&mut conn)
			{
				Ok(user_id) => Ok(user_id),
				Err(_) => Err("User not found or database error"),
			}

}


//	API Routes GET

pub async fn api_get_process_guest_email(
	Path(email): Path<String>,
	Extension(pool): Extension<Arc<Pool>>
) -> impl IntoResponse {
	let clean_email = handle_error!(sanitize_email(&email), "invalid_email");

	// Remove Below
	// let conn = handle_error!(pool.get(), "database_error");

	let result = hazardous_boolean_email_exist(clean_email, pool).await;

	match result {
		Ok(true) => error_casting("email_already_in_use"),
		Ok(false) => error_casting("valid_guest_email"),
		Err(_) => error_casting("database_error"),
	}
}

pub async fn api_get_process_username(
	Path(username): Path<String>,
	Extension(pool): Extension<Arc<Pool>>
) -> impl IntoResponse {
	let clean_username = handle_error!(
		sanitize_username(&username),
		"invalid_username"
	);
	let mut conn = handle_error!(pool.get(), "database_error");

	match
		users::table
			.inner_join(profile::table.on(profile::uuid.eq(users::id)))
			.filter(users::username.eq(clean_username))
			.select((users::all_columns, profile::all_columns))
			.first::<(User, Profile)>(&mut conn)
	{
		Ok((user, profile)) => {
			(
				StatusCode::OK,
				Json(WizardResponse {
					data: serde_json::json!({"status": "complete"}),
					message: serde_json::json!({
						"user": user,
						"profile" : profile
				}),
				}),
			)
		}
		Err(diesel::NotFound) => error_casting("username_not_found"),
		Err(_) => error_casting("database_error"),
	}
}

//	API Routes POST

pub async fn api_post_process_register_user_handler(
	Extension(pool): Extension<Arc<Pool>>,
	Json(body): Json<RegisterUserSchema>
) -> impl IntoResponse {

	//	TODO: Captcha

	let clean_email = handle_error!(
		sanitize_email(&body.email),
		"invalid_email"
	);

	match
		hazardous_boolean_email_exist(clean_email.clone(), pool.clone()).await
	{
		Ok(true) => {
			return error_casting("email_already_in_use");
		}
		Ok(false) => {}
		Err(_) => {
			return error_casting("database_error");
		}
	}

	let clean_username = handle_error!(
		sanitize_username(&body.username),
		"invalid_username"
	);

	match
		hazardous_boolean_username_exist(
			clean_username.clone(),
			pool.clone()
		).await
	{
		Ok(true) => {
			return error_casting("username_taken");
		}
		Ok(false) => {}
		Err(_) => {
			return error_casting("database_error");
		}
	}

	match validate_password(&body.password) {
		Ok(()) => {}
		Err(_) => {
			return error_casting("invalid_password");
		}
	}

	let salt = SaltString::generate(&mut OsRng);

	let generate_hashed_password = handle_error!(
		Argon2::default().hash_password(&body.password.as_bytes(), &salt),
		"invalid_hash"
	);

	println!(
		"Username: {}, Email: {}, HashPassword: {}",
		clean_username.clone(),
		clean_email.clone(),
		generate_hashed_password.to_string()
	);

	error_casting("wip_route")
}
