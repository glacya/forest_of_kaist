drop database week3;
create database week3;
use week3;
create table users(
    id varchar(16) not null primary key,
    pw varchar(60) not null,
    username varchar(20) character set utf8 collate utf8_general_ci,
    univ int
);

create table univ(
    univ_id int,
    l
)