INSERT INTO record_info (Artist, Album, Release_Date) Values ('Gloria Estefan','Let it Loose', 1987)

SELECT Artist, Album FROM record_info WHERE Release_Date = 2019

SELECT Artist, Album FROM record_info ORDER BY Artist ASC

SELECT Artist, Album FROM record_info ORDER BY Artist DESC

SELECT Artist, Album FROM record_info ORDER BY Release_Date DESC LIMIT 3
