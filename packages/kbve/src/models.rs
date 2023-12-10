// Generated by diesel_ext

#![allow(unused)]
#![allow(clippy::all)]

use diesel::Queryable;
use serde::Serialize;


use chrono::NaiveDateTime;
#[derive(Queryable, Debug, Serialize)]
pub struct Apikey {
    pub id: u64,
    pub uuid: u64,
    pub permissions: String,
    pub keyhash: String,
    pub label: String,
}

#[derive(Queryable, Debug, Serialize)]
pub struct Appwrite {
    pub id: u64,
    pub uuid: u64,
    pub appwrite_endpoint: String,
    pub appwrite_projectid: String,
    pub appwrite_api_key: String,
    pub version: String,
    pub created_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize)]
pub struct Auth {
    pub id: u64,
    pub uuid: u64,
    pub email: String,
    pub hash: String,
    pub salt: String,
    pub password_reset_token: String,
    pub password_reset_expiry: NaiveDateTime,
    pub verification_token: String,
    pub verification_expiry: NaiveDateTime,
    pub status: i32,
    pub last_login_at: NaiveDateTime,
    pub failed_login_attempts: i32,
    pub lockout_until: NaiveDateTime,
    pub two_factor_secret: String,
    pub recovery_codes: String,
}

#[derive(Queryable, Debug, Serialize)]
pub struct Global {
    pub id: u64,
    pub key: String,
    pub value: String,
}

#[derive(Queryable, Debug, Serialize)]
pub struct N8n {
    pub id: u64,
    pub uuid: u64,
    pub webhook: String,
    pub permissions: String,
    pub keyhash: String,
    pub label: String,
}

#[derive(Queryable, Debug, Serialize)]
pub struct Profile {
    pub id: u64,
    pub name: String,
    pub bio: String,
    pub unsplash: String,
    pub github: String,
    pub instagram: String,
    pub discord: String,
    pub uuid: u64,
}

#[derive(Queryable, Debug, Serialize)]
pub struct Setting {
    pub id: u64,
    pub uuid: u64,
    pub key: String,
    pub value: String,
}

#[derive(Queryable, Debug, Serialize)]
pub struct User {
    pub id: u64,
    pub username: String,
    pub role: i32,
    pub reputation: i32,
    pub exp: i32,
    pub created_at: NaiveDateTime,
}