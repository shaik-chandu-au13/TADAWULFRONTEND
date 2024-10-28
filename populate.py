import pandas as pd

# Read data from an Excel file
excel_file = 'C:/Users/rpatil01/Expleo France/emailAUtomation - General/TestingDatabase.xlsx'
data = pd.read_excel(excel_file)

# Convert the data to JSON
json_data = data.to_json(orient='records')

# Save the JSON to a file
with open('TestingDatabase.json', 'w') as json_file:
    json_file.write(json_data)

# Alternatively, you can use the following code to print the JSON data to the console:
print(json_data)

