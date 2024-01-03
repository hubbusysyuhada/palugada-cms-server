import _ from "lodash";
import Transaction from "../database/entity/Transaction";
import parseNumber from "./parseNumber";

type SeriesType = 'daily' | 'weekly' | 'monthly' | 'once'

type InsightType = {
  label: string;
  in: number[];
  out: number[];
  sumIn: number;
  sumOut: number
  totalIn: number;
  totalOut: number;
}

export default class Insight {
  constructor(
    private transactions: Transaction[],
    private series: SeriesType,
    private startDate: string,
    private endDate: string,
  ) { }

  static calculate(payload: { transactions: Transaction[]; series: SeriesType; startDate: string; endDate: string; }) {
    const { transactions, endDate, series, startDate } = payload
    const data = new Insight(transactions, series, startDate, endDate)

    const timestamps = data.InitInsight()
    data.populateInsight(timestamps)
    return timestamps
  }

  private InitInsight() {
    let initialDate = new Date(this.startDate)

    let counter = 1
    const res: Record<number, InsightType> = {}
    while (initialDate <= new Date(this.endDate)) {
      res[counter] = {
        label: this.getTimestampLabel(this.series, initialDate),
        in: [],
        out: [],
        sumIn: 0,
        sumOut: 0,
        totalIn: 0,
        totalOut: 0
      }
      if (this.series === 'once') break
      counter++
      this.dateJump(initialDate, this.series)
    }
    return res
  }

  private getTimestampLabel(series: SeriesType, date: Date) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const d = date.getDate()
    const m = date.getMonth()
    const y = date.getFullYear()

    if (series === 'monthly') return `${months[m]} ${y}`
    else if (series === 'daily') return `${parseNumber(d)} ${months[m]} ${y}`
    else if (series === 'weekly') {
      let endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 6)
      if (endDate > new Date(this.endDate)) endDate = new Date(this.endDate)
      const dEnd = endDate.getDate()
      const mEnd = endDate.getMonth()
      const yEnd = endDate.getFullYear()

      return `${parseNumber(d)} ${months[m]} ${y} - ${parseNumber(dEnd)} ${months[mEnd]} ${yEnd}`
    }
    else if (series === 'once') {
      const endDate = new Date(this.endDate)
      const dEnd = endDate.getDate()
      const mEnd = endDate.getMonth()
      const yEnd = endDate.getFullYear()

      return `${parseNumber(d)} ${months[m]} ${y} - ${parseNumber(dEnd)} ${months[mEnd]} ${yEnd}`
    }
  }

  private dateJump(date: Date, series: SeriesType) {
    if (series === 'daily') date.setDate(date.getDate() + 1)
    else if (series === 'weekly') date.setDate(date.getDate() + 7)
    else if (series === 'monthly') date.setMonth(date.getMonth() + 1)
  }

  private populateInsight(p: Record<number, InsightType>) {
    this.transactions.forEach(t => {
      const index = this.getTimestampIndex(t)
      const key = t.type.toLowerCase()
      p[index][`sum${_.startCase(key)}`] += t.total_price
      p[index][`total${_.startCase(key)}`]++
      p[index][key].push(t.total_price)
    })
    return p
  }

  private getTimestampIndex(t: Transaction) {
    const start = new Date(this.startDate)
    const end = new Date(t.created_at)
    if (this.series === 'once') return 1
    else if (this.series === 'monthly') {
      let months = (end.getFullYear() - start.getFullYear()) * 12 + 1;
      months -= start.getMonth();
      months += end.getMonth();
      return months
    }
    else {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);

      if (this.series === 'daily') return diffDays + 1
      return diffWeeks + 1
    }
  }
}