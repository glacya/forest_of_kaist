drop database week3;
create database week3;
use week3;
create table users(
    id varchar(16) not null primary key,
    pw varchar(88) not null,
    username varchar(20) character set utf8 collate utf8_general_ci,
    salt varchar(88),
    univ int
);

create table univ(
    univ_id int,
    univ_name varchar(40) character set utf8 collate utf8_general_ci
);

-- insert examples
-- insert into users(id, pw, username, salt, univ) values ("admin", "aquat", username, "pp", 1);