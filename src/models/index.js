const Sequelize = require("sequelize");
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + '/../config/config.json')['test'];

const db = {}
const sequelize = new Sequelize( config.database, config.username, config.password, config);

db.sequelize = sequelize;

const joinquipuModelsDir = path.join(__dirname, 'joinquipuModels');

fs
    .readdirSync(joinquipuModelsDir) // 현재 폴더의 모든 파일을 조회
    .filter(file => { // 숨김 파일, index.js, js 확장자가 아닌 파일 필터링
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => { // 해당 파일의 모델 불러와서 init
      const model = require(path.join(joinquipuModelsDir, file));
      console.log(file, model.name);
      db[model.name] = model;
      model.initiate(sequelize);
    });

Object.keys(db).forEach(modelName => { // associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

