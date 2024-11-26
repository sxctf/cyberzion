import sqlite3
from sqlite3 import Error
from os import path


db_file = path.abspath(path.dirname(__file__))
db_file = path.join(db_file, 'db/db.db')

sql_create_pills_table = """ CREATE TABLE IF NOT EXISTS "pills" (
                            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                            "color" text NOT NULL); """

sql_create_choice_table = """ CREATE TABLE IF NOT EXISTS "choice" (
                            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                            "name" text,
                            "int" int
                            );"""

sql_insert_pills = """INSERT INTO pills (id, color) VALUES 
                                        ('5', 'Blue'),
                                        ('4', 'Blue'),
                                        ('3', 'Blue'),
                                        ('2', 'Blue'),
                                        ('1', 'Blue');
                                        """

sql_insert_choice = """INSERT INTO choice (id, name,int) VALUES 
                                    ('3', 'cyzi{0K8g4oCTINCT0LvQsNCy0L3Ri9C5INCQ0YDRhdC4}','1'),
                                    ('2', 'Blue','1'),
                                    ('1', 'Blue','1');
                                        """

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
        c.fetchall()
    except Error as e:
        print(e)

def insert_data_to_table(conn,expression):
    try:
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute(expression)
        row = cur.fetchall()
        conn.commit()
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

def createDB():
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    if conn is not None:
        create_table(conn, sql_create_choice_table)
        create_table(conn, sql_create_pills_table)
        insert_data_to_table(conn, sql_insert_choice)
        insert_data_to_table(conn, sql_insert_pills)
         
    if not path.exists(db_file):
        def create_connection(db_file):
            conn = None
        try:
            conn = sqlite3.connect(db_file)
        except Error as e:
            print(e)
        finally:
            if conn:
                conn.close()
def getPill(id):
    row = ""
    try:
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute('SELECT * from pills where id=' + id)
        
        row = cur.fetchall()
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()
            return row

def getFlag():
    flag = ""
    try:
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute('SELECT name from choice where id=3')
        row = cur.fetchall()
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()
            return row