import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import { load } from "./src/common/config/load"
import { configToTypeOrmOptions, DatabaseConfig } from "./src/modules/database/config"

dotenv.config({ path: ".env" })

const databaseConfig = load(DatabaseConfig)

const dataSource = new DataSource(configToTypeOrmOptions(databaseConfig))

export default dataSource
