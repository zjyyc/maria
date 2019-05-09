create table data_config(
    id int not null AUTO_INCREMENT , 
    title VARCHAR(256) , 
    config TEXT ,
    author varchar(256),
    users varchar(512) ,
    gmt_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    pics MEDIUMTEXT default '',
    status int default 0 ,
    primary key(id)
)
 
alter table  data_config add version int default 0 
create table data(
    id int not null AUTO_INCREMENT , 
    parent_id int not null default 0 ,
    title VARCHAR(256) , 
    config TEXT ,
    author varchar(256) default '',
    managers varchar(256) default '',
    users varchar(512) default '',
    gmt_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    pics MEDIUMTEXT default '',
    data MEDIUMTEXT,
    version int default 1 ,
    version_author varchar(256),
    status int default 0 ,
    primary key(id)
)
alter table  data add version_author varchar(256) default ''

alter table data alter column users set default ''

alter table data add relative_ids varchar(1000) not null default '' 
alter table data add parent_id int not null default 0 
alter table data add managers varchar(256) not null default '' 


create table user(
    id int not null AUTO_INCREMENT , 
    username varchar(20) NOT NULL unique ,
    passwd varchar(256),
    company varchar(256),
    type int default 2 ,
    gmt_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    primary key(id)
)

create table data(
    id int not null AUTO_INCREMENT , 
    config_id int not null ,
    data MEDIUMTEXT,
    gmt_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    user_name varchar(256),
    status int default 0 ,
    primary key(id)
)


select data.id as id , config_id, config , pics ,   data from data 
INNER JOIN data_config where data_config.id = 4 
and data.config_id = data_config.id order by data.id desc limit 1


create user data@localhost identified by 'happy2018';
grant all on *.* to data@'%' indentified by 'happy2018';
grant all privileges on *.* to data@'%' identified by 'happy2018';
grant all privileges on *.* to data@'%' identified by 'happy2018' with grant option;

grant all privileges on *.* to data@'%' identified by 'happy2018';
flush privileges;

create table active(
    id int not null AUTO_INCREMENT , 
    f1 VARCHAR(256) , 
    f2 VARCHAR(256) , 
    f3 VARCHAR(256) , 
    data TEXT,
    site int not null ,
    primary key(id)
)


create table job_student(
    tel BIGINT not null ,
    no BIGINT ,
    name varchar(20) ,
    class1 varchar(50) ,
    pics varchar(500) ,
    primary key(tel)
)
alter table job_student alter column name set default ''
drop table job_student

create table job_apply(
    tel BIGINT not null ,
    company_id BIGINT not null ,
    job_id BIGINT not null ,
    type int not null default 0 ,
    manager varchar(30) ,
    gmt_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    primary key(tel , job_id) 
)
alter table job_apply add unique index(tel,job_id);
drop table job_apply










