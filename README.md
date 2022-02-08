# Project description

Project containing:
- An API that inserts given dataset into database
- An API Endpoint that returns the concerts matching the criterias given by the user from different datasets (found in data folder)
- A visual interface that allows the user to manage the 2 APIs

# Requirements

- Nothing running on port 3306 and 4242 (default ports)
- NodeJS installed (ver. > 16)
- Docker installed (ver. > 20)
- docker-compose installer (ver. > 1.29)
- (optionnal) Ansible installed (ver. > 2)

# Getting started
Start the project using docker-compose:
```bash
docker-compose -f docker-compose.override.yml up
```


# Other

Doc used to calculate boundaries:
http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates