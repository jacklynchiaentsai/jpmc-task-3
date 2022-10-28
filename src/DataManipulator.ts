// processing raw stock data we receive from server before Graph.tsx renders it
import { ServerRespond } from './DataStreamer';

// updating to match new schema
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row{
    // averaging top ask and top bid price to get price of stock
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1+0.05;
    const lowerBound = 1-0.05;
    let timeStamp = serverRespond[1].timestamp;
    if (serverRespond[0].timestamp > serverRespond[1].timestamp){
        timeStamp = serverRespond[0].timestamp;
    }
    let triggerAlert = undefined;
    if (ratio > upperBound || ratio < lowerBound){
        triggerAlert = ratio;
    }

    return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: timeStamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: triggerAlert
    };
  }
}
