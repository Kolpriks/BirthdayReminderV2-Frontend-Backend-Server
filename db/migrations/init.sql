create table users (
    id bigserial primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    email varchar(200) unique not null,
    password varchar(500) not null,
)
