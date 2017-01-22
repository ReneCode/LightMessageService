# LightMessageService

[![Build Status](https://travis-ci.org/ReneCode/LightMessageService.svg?branch=master)](https://travis-ci.org/ReneCode/LightMessageService)

The Backend.

first project wich travis integration ci & cd

---

some hints for MongoDb

mongod --config=mongod.cfg

example for mongod.cfg

    systemLog:
        destination: file
        path:  /mongo/log/mongo.log
    storage:
        dbPath: /mongo/data
        directoryPerDb: true


-----

docker -P
    ports automatisch veröffentlichen
docker port <id>
    verwendete ports anzeigen


.dockerignore
