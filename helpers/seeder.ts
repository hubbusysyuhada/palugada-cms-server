import { SqlEntityManager } from "@mikro-orm/mysql";
import Employee from "../database/entity/Employee";
import Item from "../database/entity/Item";
import Transaction from "../database/entity/Transaction";
import parseNumber from "./parseNumber";
import TransactionItem from "../database/entity/TransactionItem";

export default async (em: SqlEntityManager) => {
  let initialDate = new Date('09/01/2023')
  let endDate = new Date('12/31/2023')
  let dayCounter = 0
  const employees = await em.find(Employee, { is_active: true })

  while (initialDate <= endDate) {

    if (dayCounter === 6) {
      dayCounter = 0
      const length = randomNumber(1, 4)
      const items = Array.from(Array(length).keys()).map(_ => ({ price: randomNumber(250000, 500000), name: randomChoice(['A', 'B', 'C', 'D', 'E', 'F', 'G']) }))
      await createTransaction(em, generateOutPayload(items, 'Restock'), new Date(initialDate))
    }
    if (initialDate.getDate() === 25) {
      const items = employees.map(e => ({ price: 1500000, name: `Gaji ${e.name} bulan ${initialDate.getMonth() + 1}` }))
      await createTransaction(em, generateOutPayload(items, 'Gaji Karyawan'), new Date(initialDate))
    }

    if (randomBoolean()) {
      for (let i = 0; i < randomNumber(0, 3); i++) { // transaction per day
        const availableItems = await em.find(Item, { stock: { $gt: 0 } })
        const items: Record<string, any> = []
        for (let j = 0; j < randomNumber(0, 2); j++) { // item per transaction
          const index = randomNumber(0, availableItems.length)
          items.push({
            id: availableItems[index].id,
            amount: randomNumber(1, 3)
          })
        }
        const payload = generateInPayload({
          items,
          mechanicIds: [randomChoice(employees.map(e => e.id))],
          notes: '',
          services: [
            {
              "name": "tune up",
              "price": 150000
            }
          ]
        })
        await createTransaction(em, payload, new Date(initialDate))
      }
    }
    initialDate.setDate(initialDate.getDate() + 1)
    dayCounter++
  }
}


const generateInPayload = (payload: { services: Record<string, any>[]; notes: string; mechanicIds: string[]; items: Record<string, any> }) => {
  const { services, items, mechanicIds, notes } = payload
  const cust = randomNumber(1, 150)
  return {
    vehicle_type: `Mobil ${cust}`,
    plate_number: `${randomCharacter(1, true)}${randomNumber(1001, 9999)}${randomCharacter(3, true)}`,
    customer_name: `Customer ${cust}`,
    customer_phone: "-",
    mechanicIds,
    items,
    notes,
    services,
    type: "IN"
  }
}

const generateOutPayload = (services: Record<string, any>[], notes: string) => {
  return {
    vehicle_type: "",
    plate_number: "",
    customer_name: "direktur",
    customer_phone: "-",
    mechanicIds: [],
    items: [],
    notes,
    services,
    type: "OUT"
  }
}

const createTransaction = async (em: SqlEntityManager, payload: Record<string, any>, created_at: Date) => {
  try {
    await em.begin()
    const transaction = new Transaction()
    const now = created_at
    const dateCode = `${parseNumber(now.getDate())}${parseNumber(now.getMonth() + 1)}${String(now.getFullYear())[2]}${String(now.getFullYear())[3]}`
    const typeCode = payload.type === 'IN' ? '01' : '02'
    const [_, todaysTransactionCount] = await em.findAndCount(Transaction, { invoice: { $like: `${dateCode}%` } })
    const transactionCode = parseNumber(todaysTransactionCount + 1)
    const services: Record<string, any>[] = []
    transaction.total_price = 0
    transaction.customer_name = payload.customer_name
    transaction.customer_phone = payload.customer_phone
    transaction.notes = payload.notes
    transaction.plate_number = payload.plate_number
    transaction.vehicle_type = payload.vehicle_type
    transaction.created_at = now
    transaction.invoice = dateCode + typeCode + transactionCode
    transaction.type = payload.type

    payload.services.forEach((s: { name: string; price: number; }) => {
      services.push(s)
      transaction.total_price += s.price
    })
    transaction.additional_services = services

    for (const id of payload.mechanicIds) {
      const employee = await em.findOneOrFail(Employee, { id })
      transaction.mechanics.add(employee)
    }

    for (const item of payload.items) {
      const { id, amount } = item
      const itemFound = await em.findOneOrFail(Item, { id })
      const transactionItem = new TransactionItem()
      transactionItem.transaction = transaction
      transactionItem.item = itemFound
      transactionItem.amount = amount
      itemFound.stock -= amount
      transaction.total_price += amount * itemFound.selling_price
      em.persist(transactionItem)
      em.persist(itemFound)
    }
    em.persist(transaction)
    await em.commit()
    // rep.code(201).send({ message: "Transaction created" })
  } catch (error) {
    console.log("error", error);
    await em.rollback()
    throw new Error(error)
  }
}

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomChoice = (arr: any[]) => {
  const index = randomNumber(0, arr.length - 1)
  return arr[index]
}

const randomBoolean = () => {
  return Math.random() > 0.5
}

const randomCharacter = (length: number, isUpperCase?: boolean) => {
  let res = ''

  let dictionary = 'abcdefghijklmnopqrstuvwxyz'
  if (isUpperCase) dictionary = dictionary.toUpperCase()

  for (let i = 0; i < length; i++) {
    res += dictionary[randomNumber(0, dictionary.length)]
  }
  return res
}