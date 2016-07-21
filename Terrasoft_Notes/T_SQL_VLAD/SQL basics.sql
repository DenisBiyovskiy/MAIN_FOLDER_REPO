SQL, 'Structured Query Language', is a programming language designed to manage data stored in relational databases. SQL operates through simple, declarative statements. This keeps data accurate and secure, and helps maintain the integrity of databases, regardless of size.
to create table:
CREATE TABLE celebs (id INTEGER, name TEXT, age INTEGER);
This CREATE statement creates a new table in the database named celebs. You can use the CREATE statement anytime you want to create a new table from scratch.

1. CREATE TABLE is a clause that tells SQL you want to create a new table.
2. celebs is the name of the table.
3. (id INTEGER, name TEXT, age INTEGER) is a list of parameters defining each column in the table and its data type.

- id is the first column in the table. It stores values of data type INTEGER
- name is the second column in the table. It stores values of data type TEXT
- age is the third column in the table. It stores values of data type INTEGER

to add row to the table:
INSERT INTO celebs (id, name, age) VALUES (1, 'Justin Bieber', 21);

to view the data from the table:
SELECT * FROM celebs;

to update the data of the table:
UPDATE celebs SET age = 22 WHERE id = 1;

to add the column to the table:
ALTER TABLE celebs ADD COLUMN twitter_handle TEXT;

to delete the column of the table:
DELETE FROM celebs WHERE twitter_handle IS NULL;
__________________________________________________

Multiple columns can be queried at once by separating column names with a comma. By specifying name, imdb_rating, the result set contains a name and imdb_rating column:
SELECT name, imbd_rating FROM movies;

SELECT DISTINCT is used to return unique values in the result set. It filters out all duplicate values. Here, the result set lists each genre in the movies table exactly once:
SELECT DISTINCT genre FROM movies;


SELECT * FROM movies WHERE name LIKE 'A%';
This statement filters the result set to only include movies with names that begin with the letter "A"
% is a wildcard character that matches zero or more missing letters in the pattern.
SELECT * FROM movies WHERE name LIKE '%man%';
You can use % both before and after a pattern. Here, any movie that contains the word "man" in its name will be returned in the result set. Notice, that LIKE is not case sensitive. "Batman" and "Man Of Steel" both appear in the result set.

BETWEEN is another special operator that can be used in a WHERE clause. 
SELECT * FROM movies WHERE name BETWEEN 'A' AND 'J';
SELECT * FROM movies WHERE year BETWEEN 1990 AND 2000;

Instead of returning every movie made BETWEEN 1990 and 2000, let's just return the movies that are comedies. 
SELECT * FROM movies WHERE year BETWEEN 1990 AND 2000 AND genre = 'comedy';
Similar to AND, the OR operator can be used with the WHERE clause, but there are some important differences.
SELECT * FROM movies WHERE genre = 'comedy' OR year < 1980;

It is often useful to list the data in our result set in a particular order. In the code editor type
SELECT * FROM moviesORDER BY imdb_rating DESC;

The fastest way to calculate the number of rows in a table is to use the COUNT() function.
COUNT() is a function that takes the name of a column as an argument and counts the number of rows where the column is not NULL. Here, we want to count every row so we pass * as an argument.
Count how many apps are in the database. In the code editor replace the previous statement with
SELECT COUNT(*) FROM fake_apps;

Count the number of apps at each price. 
SELECT price, COUNT(*) FROM fake_apps GROUP BY price;
results:
pricecount (*)0.0730.9943


SQL makes it easy to add all values in a particular column using SUM().
SUM() is a function that takes the name of a column as an argument and returns the sum of all the values in that column. Here, it adds all the values in thedownloads column.
SELECT SUM(downloads) FROM fake_apps;


You can find the largest value in a column by using MAX().
MAX() is a function that takes the name of a column as an argument and returns the largest value in that column. Here, we pass downloads as an argument so it will return the largest value in the downloads column.
SELECT MAX(downloads) FROM fake_apps;

Similar to MAX(), SQL also makes it easy to return the smallest value in a column by using the MIN() function.
MIN() is a function that takes the name of a column as an argument and returns the smallest value in that column. Here, we pass downloads as an argument so it will return the smallest value in the downloads column.
SELECT MIN(downloads) FROM fake_apps;

This statement returns the average number of downloads for an app in our database. SQL uses the AVG() function to quickly calculate the average value of a particular column.
The AVG() function works by taking a column name as an argument and returns the average value for that column.
SELECT AVG(downloads) FROM fake_apps;

By default, SQL tries to be as precise as possible without rounding. We can make the result set easier to read using the ROUND() function.
ROUND() is a function that takes a column name and an integer as an argument. It rounds the values in the column to the number of decimal places specified by the integer. Here, we pass the columnAVG(downloads) and 2 as arguments. SQL first calculates the average for each price and then rounds the result to two decimal places in the result set.
SELECT price, ROUND(AVG(downloads), 2) FROM fake_apps GROUP BY price;

Congratulations! You just learned how to use aggregate functions to perform calculations on your data. What can we generalize so far?
- Aggregate functions combine multiple rows together to form a single value of more meaningful information.COUNT takes the name of a column(s) as an argument and counts the number of rows where the value(s) is not NULL.GROUP BY is a clause used with aggregate functions to combine data from one or more columns.SUM() takes the column name as an argument and returns the sum of all the values in that column.MAX() takes the column name as an argument and returns the largest value in that column.MIN() takes the column name as an argument and returns the smallest value in that column.AVG() takes a column name as an argument and returns the average value for that column.ROUND() takes two arguments, a column name and the number of decimal places to round the values in that column.

using PHP with MySQL

код соединения с дб mysql:
<?php
try {
    $db = new PDO("mysql:host=localhost;dbname=shirts4mike;port=3306","root","");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("SET NAMES 'utf8'");
} catch (Exception $e) {
    echo $e;
    exit;
}
?>

для подключения к базе данных мы используем объект PDO
вторая строка кода указывает что мы будем использовать отладочный режим для полного отображения всех ошибок.
третья устанавливает кодировку обращения к бд. В большинстве случаев используется именно utf-8

___________________________________________________________________________________________________
SQL QUERY

SELECT column_1_name, column_2_name FROM table_name, etc:
SELECT name, price FROM products;
___________________________________________________________________________________________________

при использовании PDO: есть метод query через который можно отправлять запросы:
try{
    $results = $db->query("SELECT name, price FROM products");
} catch (Exception $e) {

}
Важным является то, что при использовании метода query в переменную $result возвращается не прямой результат выборки, а специальный объект - PDOStatement, который дает доступ к результатам выборки:
var_dump($results->fetchAll(PDO::FETCH_ASSOC));

Что же это за класс PDOStatement?
с офф. источника : "Представляет подготовленный запрос к базе данных, а после выполнения запроса соответствующий результирующий набор."
ccылка со списком методов и свойств класса:
http://php.net/manual/ru/class.pdostatement.php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


!!!! ДЕФОЛТНАЯ НАСТРОЙКА ДЛЯ APACHE !!!
для того чтобы сайт открывался по запросу localhost необоходимо:
-установить xampp
-залезть в файл \xampp\apache\conf\httpd.conf и в нем найти строки DocumentRoot & Directory, которые по умолчанию на
xampp\htdocs, заменить их на свой проект
например:
DocumentRoot "C:/xampp/htdocs/currentP/public"
<Directory "C:/xampp/htdocs/currentP/public">
- если апач был запущен, ПЕРЕЗАПУСТИТЬ

при желании можно еще залезть в hosts и там поменять стандартный 127.0.0.1 localhost на что то свое типа
127.0.0.1       laravel.dev

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

