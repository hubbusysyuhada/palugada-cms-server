import { createHash } from "crypto"
import env from "./env"
import { machineId } from "node-machine-id"

export default async () => env.APP_PERMISSION_TOKEN !== createHash('sha256').update(`${env.APP_KEY}+${await machineId()}`).digest('hex')