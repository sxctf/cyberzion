import sqlite3, os.path


def create_table():
    if os.path.exists('./db/data.db'):
        return "Database exist"
    else:
        # Create table
        try:
            sqliteConnection = sqlite3.connect('./db/data.db')
            sqlite_create_table_query = '''CREATE TABLE IF NOT EXISTS persons (
                                            id VARCHAR(255) PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
                                            frequency VARCHAR(255) NOT NULL,
                                            secret_code VARCHAR(255) NOT NULL);'''
            cursor = sqliteConnection.cursor()
            print("Successfully Connected to SQLite")
            cursor.execute(sqlite_create_table_query)
            sqliteConnection.commit()
            print("SQLite table created")

            cursor.close()
            
        except sqlite3.Error as error:
            print("Error while creating a sqlite table", error)
        finally:
            if sqliteConnection:
                sqliteConnection.close()
                print("sqlite connection is closed")
                    

def insert_person(id, name, frequency, secret_code):
    # Insert data
    try:
        sqliteConnection = sqlite3.connect('./db/data.db')
        sqlite_insert_query = f'''INSERT INTO persons VALUES ('{id}', '{name}', '{frequency}', '{secret_code}');'''
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_insert_query)
        sqliteConnection.commit()
        print("Data successfully inserted", cursor.rowcount)
        cursor.close()

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")
            
def check(frequency):
    elements = []
    data = []
    #Check data
    try:
        sqliteConnection = sqlite3.connect('./db/data.db')
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute("SELECT * FROM persons WHERE frequency = (?)", (frequency,))
        records = cursor.fetchall()
        # print(records)
        for row in records:
            elements.append(row[0])
            elements.append(row[1])
            elements.append(row[2])
            elements.append(row[3])
            data.append(elements)
            elements = []   
        
        cursor.close()
        
        return data
    
    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")