create table if not exists users (
	id serial primary key,
	first_name varchar(30) not null,
	second_name varchar(30) not null,
	email varchar(250) not null unique,
	password varchar(100) not null
);

create table if not exists birthdays (
	user_id int not null,
	first_name varchar(30) not null,
	second_name varchar(30) not null,
	date date not null,
	primary key(user_id, first_name, second_name, date),
	foreign key(user_id) references users(id) on delete cascade
);
