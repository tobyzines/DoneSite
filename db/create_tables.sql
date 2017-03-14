
create table if not exists boss_builds (name varchar(100), details varchar(2000));
--  "bossName" : "Vale Guardian",
--  "totalBuilds" : 1,
--  "build" : [ [ 30, 62, 00, 70, 90, 31, 60, 01, 70, 90 ] ]

create table if not exists experience (person varchar(200), details varchar(2000));

--  "personName" : "Atri",
--  "gearedBuilds" : {
--      "00" : 4,
--      "01" : 4,
--      "02" : 0,
--      "10" : 4,
--      "11" : 4,
--      "12" : 4,
--      "13" : 4,
--      "20" : 3,
--      "21" : 4,
--      "30" : 3,
--      "31" : 4,
--      "32" : 0,
--      "40" : 4,
--      "41" : 4,
--      "42" : 3,
--      "50" : 4,
--      "60" : 4,
--      "61" : 4,
--      "62" : 4,
--      "63" : 4,
--      "64" : 4,
--      "70" : 3,
--      "71" : 4,
--      "80" : 3,
--      "81" : 0
--    }

create table if not exists profession_builds (name varchar(200), details varchar(2000));

--  "buildName" : "Berserker Power PS",
--  "class" : "Warrior",
--  "id" : "00"
