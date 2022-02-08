# Project description

Project containing:
- An API that inserts given dataset into database
- An API Endpoint that returns the concerts matching the criterias given by the user from different datasets (found in data folder)
- A visual interface that allows the user to use the 2 APIs 

# Requirements

- Nothing running on port 3306 and 4242 (default ports)
- NodeJS installed (ver. > 16)
- Docker installed (ver. > 20)
- docker-compose installed (ver. > 1.29)

# Getting started
### 1. Copy and modify env file
Create an .env file using the sample and edit to insert a database password:
```bash
cp env-sample .env
vim .env
```
### 2. Start project
Start the project using docker-compose:
```bash
docker-compose up
```
### 3. Initialize using Admin panel
Go to the admin panel from your web browser to initialize database and load the default dataset into it.
```bash
http://localhost:4242/
```

![project_img](https://i.ibb.co/P458XM7/Screenshot-from-2022-02-09-16-47-05.png)

### 4. Try it !
Use the admin panel to make searches or use the REST API :

```bash
URL => http://localhost:4242/api/search
Method => POST
JSON Parameters => {
  bandIds: array of string (or comma separated list)
  latitude: float
  longitude: float
  radius: Int - In kilometers
}

The user must at least provide `bandIds` *OR* `latitude`/`longitude`/`radius` (But can provide all the fields too)
```

# Other

Doc used to calculate boundaries:
http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
