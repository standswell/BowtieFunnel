from faker import Faker
import pandas as pd

# Initialize the Faker library
fake = Faker()

# Define the initial data
data = {
    'month': [0]*7,
    'actual': [fake.random_int(min=200, max=500) for _ in range(7)],
    'budget': [fake.random_int(min=200, max=500) for _ in range(7)],
    'prior': [fake.random_int(min=200, max=500) for _ in range(7)],
    'forecast': [fake.random_int(min=200, max=500) for _ in range(7)],
    'futureBudget': [fake.random_int(min=200, max=500) for _ in range(7)],
    'label': ['Awareness', 'Familiarity', 'Consideration', 'Purchase', 'Loyalty', 'Champion', 'Churn']
}

# Create a DataFrame from the initial data
df = pd.DataFrame(data)

# Generate data for the next 11 months
for month in range(1, 12):
    new_data = df[df['month'] == month-1].copy()
    new_data['month'] = month
    new_data['prior'] = new_data['actual']
    new_data['actual'] = [fake.random_int(min=200, max=500) for _ in range(7)]  # Generate new 'actual' values
    new_data['budget'] = round(new_data['budget'] * 1.02)  # Increase budget by 10% and round to nearest integer
    df = pd.concat([df, new_data])

# Print the full dataset
print(df)

# Save the DataFrame to a CSV file
df.to_csv('C:/Users/GeraldDunn/OneDrive - Dunn/NewLibrary/Code/BowtieFunnel/data/data.csv', index=False)